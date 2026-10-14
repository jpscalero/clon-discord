import { Guild, GuildMember, Channel, Permissions, ALL_PERMISSIONS } from '../types';

export { Permissions, ALL_PERMISSIONS };

export function roleHasPermission(rolePermissions: bigint, permission: bigint): boolean {
  return (rolePermissions & permission) === permission;
}

/**
 * Motor de resolución de permisos Bitwise de Discord (64 bits)
 */
export function computePermissions(
  member: GuildMember,
  guild: Guild,
  channel?: Channel
): bigint {
  // 1. Propietario del Servidor: Acceso total incondicional
  if (member.userId === guild.ownerId) {
    return ALL_PERMISSIONS;
  }

  // 2. Rol base @everyone (el rol cuyo ID coincide con el ID del servidor)
  const everyoneRole = guild.roles.find((r) => r.id === guild.id) || guild.roles[0];
  let permissions = everyoneRole ? everyoneRole.permissions : 0n;

  // 3. Acumulación por OR bitwise de todos los roles asignados al miembro
  for (const roleId of member.roleIds) {
    const role = guild.roles.find((r) => r.id === roleId);
    if (role) {
      permissions |= role.permissions;
    }
  }

  // 4. Si tiene ADMINISTRATOR, se ignoran las restricciones del canal
  if ((permissions & Permissions.ADMINISTRATOR) === Permissions.ADMINISTRATOR) {
    return ALL_PERMISSIONS;
  }

  // Si no se evalúa un canal específico, devolver los permisos base del servidor
  if (!channel || !channel.overwrites) {
    return permissions;
  }

  // 5. Aplicar sobrescritura del canal para @everyone
  const everyoneOverwrite = channel.overwrites.find((o) => o.id === guild.id);
  if (everyoneOverwrite) {
    permissions = (permissions & ~everyoneOverwrite.deny) | everyoneOverwrite.allow;
  }

  // 6. Aplicar sobrescrituras del canal para los roles del usuario
  let roleDeny = 0n;
  let roleAllow = 0n;
  for (const roleId of member.roleIds) {
    const roleOverwrite = channel.overwrites.find((o) => o.id === roleId);
    if (roleOverwrite) {
      roleDeny |= roleOverwrite.deny;
      roleAllow |= roleOverwrite.allow;
    }
  }
  permissions = (permissions & ~roleDeny) | roleAllow;

  // 7. Sobrescritura específica del miembro (prioridad máxima)
  const memberOverwrite = channel.overwrites.find((o) => o.id === member.userId);
  if (memberOverwrite) {
    permissions = (permissions & ~memberOverwrite.deny) | memberOverwrite.allow;
  }

  return permissions;
}

export function hasPermission(
  member: GuildMember,
  guild: Guild,
  permission: bigint,
  channel?: Channel
): boolean {
  const computed = computePermissions(member, guild, channel);
  return (computed & permission) === permission;
}
