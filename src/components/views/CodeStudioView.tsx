import React, { useState } from 'react';
import {
  Code2,
  Play,
  Copy,
  Check,
  Plus,
  Terminal,
  FileCode,
  Sparkles,
  RefreshCw,
  FolderTree,
  FileText,
  Braces,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const CodeStudioView: React.FC = () => {
  const { activeChannelId, codeStudioFiles, updateCodeFile, createCodeFile } = useChatStore();

  const files = codeStudioFiles[activeChannelId] || [
    {
      id: 'default-1',
      name: 'index.ts',
      language: 'typescript',
      content: `// Code Studio Pro - Discord Clone\nconsole.log("¡Bienvenido al entorno de desarrollo colaborativo!");`,
    },
  ];

  const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id || 'default-1');
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '🚀 Discord Code Studio v2.4 listo',
    '⚡ Compilador JIT en memoria inicializado',
    'Presiona [Ejecutar Código] para compilar y probar.',
  ]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleContentChange = (newContent: string) => {
    if (activeFile) {
      updateCodeFile(activeChannelId, activeFile.id, newContent);
    }
  };

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewFile = () => {
    const fileName = prompt('Nombre del nuevo archivo (ej: auth.ts, schema.sql, main.rs):');
    if (!fileName || !fileName.trim()) return;

    let lang = 'typescript';
    if (fileName.endsWith('.rs')) lang = 'rust';
    if (fileName.endsWith('.py')) lang = 'python';
    if (fileName.endsWith('.go')) lang = 'go';
    if (fileName.endsWith('.json')) lang = 'json';
    if (fileName.endsWith('.sql')) lang = 'sql';

    createCodeFile(
      activeChannelId,
      fileName.trim(),
      lang,
      `// ${fileName.trim()}\n// Creado en Discord Code Studio\n\nexport function init() {\n  return "Ready";\n}\n`
    );
  };

  const handleRunCode = () => {
    if (!activeFile) return;
    setIsRunning(true);
    setTerminalOutput((prev) => [
      ...prev,
      `\n$ ${activeFile.language} run ./${activeFile.name}`,
      'Compilando módulos AST...',
    ]);

    setTimeout(() => {
      setIsRunning(false);
      if (activeFile.name.includes('snowflake')) {
        const id1 = '123849102938471928';
        const id2 = '123849102938471929';
        setTerminalOutput((prev) => [
          ...prev,
          `✔ Compilación exitosa en 42ms`,
          `[Snowflake 64-bit] Generated ID #1: ${id1}`,
          `[Snowflake 64-bit] Generated ID #2: ${id2}`,
          `[Benchmark]: 4,096,000 IDs generados/segundo sin colisiones`,
          `✨ Proceso terminado con exit code 0`,
        ]);
      } else if (activeFile.name.includes('sfu') || activeFile.name.includes('rs')) {
        setTerminalOutput((prev) => [
          ...prev,
          `✔ Rust Tokio runtime iniciado en 0.003s`,
          `[LiveKit SFU Relay]: Escuchando en 0.0.0.0:7880 (UDP RTP)`,
          `[Audio Codec]: Opus 384kbps Stereo • DTX habilitado • FEC activo`,
          `[Crypto Pipeline]: MLS DAVE Encrypted Transform validado`,
          `✨ Proceso en ejecución sin paquetes perdidos (0.0% loss)`,
        ]);
      } else {
        setTerminalOutput((prev) => [
          ...prev,
          `✔ Ejecutado con éxito`,
          `Salida estándar: "Proceso completado sin errores"`,
          `✨ Exit code 0`,
        ]);
      }
    }, 600);
  };

  const lines = (activeFile?.content || '').split('\n');

  return (
    <div className="flex-1 h-full bg-[#1e1f22] flex flex-col overflow-hidden select-none">
      {/* Top Header / Tabs Bar */}
      <div className="h-12 bg-[#2b2d31] border-b border-[#1f2023] flex items-center justify-between px-3">
        {/* Left: Files Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 pr-2 mr-2 border-r border-[#3f4147] text-[#949ba4] text-xs font-semibold">
            <FolderTree className="w-3.5 h-3.5 text-[#5865f2]" />
            <span>STUDIO</span>
          </div>

          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                activeFile?.id === file.id
                  ? 'bg-[#1e1f22] text-[#f2f3f5] shadow border border-[#3f4147]/50'
                  : 'text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#35373c]/60'
              }`}
            >
              <FileCode
                className={`w-3.5 h-3.5 ${
                  file.language === 'typescript'
                    ? 'text-[#3178c6]'
                    : file.language === 'rust'
                    ? 'text-[#f74c00]'
                    : 'text-[#5865f2]'
                }`}
              />
              <span>{file.name}</span>
            </button>
          ))}

          <button
            onClick={handleCreateNewFile}
            title="Crear nuevo archivo"
            className="p-1.5 text-[#949ba4] hover:text-white hover:bg-[#35373c] rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#80848e] px-2 py-0.5 bg-[#1e1f22] rounded border border-[#3f4147]/40 uppercase">
            {activeFile?.language || 'plain'}
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#35373c] hover:bg-[#3f4147] text-[#dbdee1] rounded-lg text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#23a55a]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-[#23a55a] hover:bg-[#1a8044] text-white rounded-lg text-xs font-semibold transition shadow-md disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Ejecutando...' : 'Ejecutar'}</span>
          </button>
        </div>
      </div>

      {/* Main Code Editor Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor Area with Line Numbers */}
        <div className="flex-1 flex bg-[#1e1f22] overflow-hidden">
          {/* Line Numbers Column */}
          <div className="w-12 py-3 bg-[#1e1f22] border-r border-[#2b2d31] select-none text-right pr-3 font-mono text-xs text-[#4e5058] leading-6">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <div className="flex-1 relative overflow-auto">
            <textarea
              value={activeFile?.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-3 bg-transparent text-[#e0e1e5] font-mono text-xs leading-6 resize-none focus:outline-none border-none selection:bg-[#5865f2]/40"
              placeholder="// Escribe o pega código aquí..."
            />
          </div>
        </div>

        {/* Integrated Terminal Simulation */}
        <div className="h-44 md:h-auto md:w-80 bg-[#18191c] border-t md:border-t-0 md:border-l border-[#2b2d31] flex flex-col">
          {/* Terminal Header */}
          <div className="h-9 px-3 bg-[#1e1f22] border-b border-[#2b2d31] flex items-center justify-between text-xs font-semibold text-[#949ba4]">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#23a55a]" />
              <span>TERMINAL DISCORD</span>
            </div>
            <button
              onClick={() => setTerminalOutput(['Console limpiada.'])}
              className="text-[10px] text-[#80848e] hover:text-[#dbdee1] transition"
            >
              Limpiar
            </button>
          </div>

          {/* Terminal Logs */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-[#23a55a] space-y-1">
            {terminalOutput.map((out, idx) => (
              <div
                key={idx}
                className={
                  out.startsWith('$')
                    ? 'text-[#f2f3f5] font-bold'
                    : out.includes('✔') || out.includes('Generated')
                    ? 'text-[#57f287]'
                    : out.includes('Benchmark')
                    ? 'text-[#fee75c]'
                    : 'text-[#949ba4]'
                }
              >
                {out}
              </div>
            ))}
          </div>

          {/* Terminal Footer */}
          <div className="p-2 border-t border-[#2b2d31] bg-[#1a1b1e] flex items-center justify-between text-[10px] text-[#80848e]">
            <span>Status: 200 OK</span>
            <span>Latency: 12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
