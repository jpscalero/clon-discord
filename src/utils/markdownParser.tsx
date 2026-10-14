import React, { useState } from 'react';

export type ASTNode =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: ASTNode[] }
  | { type: 'italic'; content: ASTNode[] }
  | { type: 'strike'; content: ASTNode[] }
  | { type: 'spoiler'; content: ASTNode[] }
  | { type: 'inlineCode'; content: string }
  | { type: 'codeBlock'; language: string; content: string }
  | { type: 'mention'; mentionType: 'user' | 'channel' | 'role'; id: string }
  | { type: 'customEmoji'; name: string; id: string; animated: boolean }
  | { type: 'quote'; content: ASTNode[] }
  | { type: 'url'; href: string };

interface Rule {
  order: number;
  match: (source: string) => RegExpExecArray | null;
  parse: (capture: RegExpExecArray, recurse: (text: string) => ASTNode[]) => ASTNode;
}

export class DFMParser {
  private rules: Rule[] = [];

  constructor() {
    this.registerRules();
  }

  private registerRules() {
    // 1. Bloques de código (máxima precedencia para evitar parsear dentro)
    this.rules.push({
      order: 1,
      match: (src) => /^```([a-zA-Z0-9_+-]+)?\n?([\s\S]*?)```/.exec(src),
      parse: (capture) => ({
        type: 'codeBlock',
        language: capture[1] || 'plaintext',
        content: capture[2],
      }),
    });

    // 2. Código inline
    this.rules.push({
      order: 2,
      match: (src) => /^`([^`\n]+)`/.exec(src),
      parse: (capture) => ({
        type: 'inlineCode',
        content: capture[1],
      }),
    });

    // 3. Spoilers ||texto||
    this.rules.push({
      order: 3,
      match: (src) => /^\|\|([\s\S]+?)\|\|/.exec(src),
      parse: (capture, recurse) => ({
        type: 'spoiler',
        content: recurse(capture[1]),
      }),
    });

    // 4. Menciones <@id>, <#id>, <@&id>
    this.rules.push({
      order: 4,
      match: (src) => /^<@(!|&)?(\w+)>/.exec(src),
      parse: (capture) => ({
        type: 'mention',
        mentionType: capture[1] === '&' ? 'role' : 'user',
        id: capture[2],
      }),
    });

    this.rules.push({
      order: 5,
      match: (src) => /^<#(\w+)>/.exec(src),
      parse: (capture) => ({
        type: 'mention',
        mentionType: 'channel',
        id: capture[1],
      }),
    });

    // 5. Emojis personalizados <:nombre:id> o <a:nombre:id>
    this.rules.push({
      order: 6,
      match: (src) => /^<(a)?:([a-zA-Z0-9_]{2,32}):(\w+)>/.exec(src),
      parse: (capture) => ({
        type: 'customEmoji',
        animated: Boolean(capture[1]),
        name: capture[2],
        id: capture[3],
      }),
    });

    // 6. Citas > texto
    this.rules.push({
      order: 7,
      match: (src) => /^>\s*(.*)/.exec(src),
      parse: (capture, recurse) => ({
        type: 'quote',
        content: recurse(capture[1]),
      }),
    });

    // 7. Formatos inline (Negrita, Tachado, Cursiva)
    this.rules.push({
      order: 8,
      match: (src) => /^\*\*([\s\S]+?)\*\*/.exec(src),
      parse: (capture, recurse) => ({
        type: 'bold',
        content: recurse(capture[1]),
      }),
    });

    this.rules.push({
      order: 9,
      match: (src) => /^~~([\s\S]+?)~~/.exec(src),
      parse: (capture, recurse) => ({
        type: 'strike',
        content: recurse(capture[1]),
      }),
    });

    this.rules.push({
      order: 10,
      match: (src) => /^\*([\s\S]+?)\*/.exec(src),
      parse: (capture, recurse) => ({
        type: 'italic',
        content: recurse(capture[1]),
      }),
    });

    // 8. URLs seguras
    this.rules.push({
      order: 11,
      match: (src) => /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/.exec(src),
      parse: (capture) => ({
        type: 'url',
        href: capture[1],
      }),
    });

    // 9. Texto plano
    this.rules.push({
      order: 100,
      match: (src) => /^[\s\S]+?(?=[<`*|~>]|https?:\/\/|$)/.exec(src),
      parse: (capture) => ({
        type: 'text',
        content: capture[0],
      }),
    });

    this.rules.sort((a, b) => a.order - b.order);
  }

  public parse(source: string): ASTNode[] {
    const nodes: ASTNode[] = [];
    let text = source;

    while (text.length > 0) {
      let matched = false;

      for (const rule of this.rules) {
        const capture = rule.match(text);
        if (capture) {
          matched = true;
          const node = rule.parse(capture, (nested) => this.parse(nested));
          nodes.push(node);
          text = text.substring(capture[0].length);
          break;
        }
      }

      if (!matched && text.length > 0) {
        nodes.push({ type: 'text', content: text[0] });
        text = text.substring(1);
      }
    }

    return nodes;
  }
}

const parser = new DFMParser();

export const DiscordMarkdown: React.FC<{
  content: string;
  getUserName?: (id: string) => string;
  getChannelName?: (id: string) => string;
}> = ({ content, getUserName, getChannelName }) => {
  const ast = parser.parse(content);

  const renderNodes = (nodes: ASTNode[]): React.ReactNode => {
    return nodes.map((node, i) => {
      switch (node.type) {
        case 'text':
          return <React.Fragment key={i}>{node.content}</React.Fragment>;
        case 'bold':
          return <strong key={i} className="font-bold text-discord-text-header">{renderNodes(node.content)}</strong>;
        case 'italic':
          return <em key={i} className="italic">{renderNodes(node.content)}</em>;
        case 'strike':
          return <del key={i} className="line-through text-discord-text-muted">{renderNodes(node.content)}</del>;
        case 'spoiler':
          return <SpoilerSpan key={i} nodes={node.content} renderNodes={renderNodes} />;
        case 'inlineCode':
          return (
            <code key={i} className="bg-discord-card text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">
              {node.content}
            </code>
          );
        case 'codeBlock':
          return (
            <div key={i} className="my-2 bg-[#1e1f22] border border-[#2b2d31] rounded-md overflow-hidden text-xs font-mono">
              <div className="bg-[#18191c] px-3 py-1 text-[11px] text-discord-text-muted border-b border-[#2b2d31] flex justify-between items-center">
                <span>{node.language}</span>
                <span className="text-[10px] text-gray-500 uppercase">Code block</span>
              </div>
              <pre className="p-3 overflow-x-auto text-emerald-400">
                <code>{node.content}</code>
              </pre>
            </div>
          );
        case 'mention':
          if (node.mentionType === 'channel') {
            const name = getChannelName ? getChannelName(node.id) : node.id;
            return (
              <span key={i} className="inline-flex items-center gap-0.5 bg-discord-blurple/20 text-[#c9cdfb] hover:bg-discord-blurple/30 hover:underline px-1 py-0.5 rounded font-medium text-xs cursor-pointer">
                #{name}
              </span>
            );
          }
          const userName = getUserName ? getUserName(node.id) : node.id;
          return (
            <span key={i} className="inline-flex items-center gap-0.5 bg-discord-blurple/20 text-[#c9cdfb] hover:bg-discord-blurple/30 hover:underline px-1 py-0.5 rounded font-medium text-xs cursor-pointer">
              @{userName}
            </span>
          );
        case 'customEmoji':
          return (
            <span key={i} className="inline-flex items-center text-xs font-semibold text-discord-blurple bg-discord-card px-1 rounded">
              :{node.name}:
            </span>
          );
        case 'quote':
          return (
            <div key={i} className="border-l-4 border-discord-divider pl-3 my-1 text-discord-text-muted italic">
              {renderNodes(node.content)}
            </div>
          );
        case 'url':
          return (
            <a
              key={i}
              href={node.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00a8fc] hover:underline"
            >
              {node.href}
            </a>
          );
        default:
          return null;
      }
    });
  };

  return <span className="leading-relaxed">{renderNodes(ast)}</span>;
};

const SpoilerSpan: React.FC<{ nodes: ASTNode[]; renderNodes: (n: ASTNode[]) => React.ReactNode }> = ({
  nodes,
  renderNodes,
}) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onClick={() => setRevealed(true)}
      title={revealed ? undefined : 'Haz clic para revelar el spoiler'}
      className={`rounded px-1 transition-all duration-200 cursor-pointer ${
        revealed
          ? 'bg-[#2b2d31]/80 text-discord-text-normal'
          : 'bg-[#232428] text-transparent hover:bg-[#282a2e] select-none filter blur-[5px]'
      }`}
    >
      {renderNodes(nodes)}
    </span>
  );
};
