/**
 * Generador de identificadores Snowflake de 64 bits (estilo Discord)
 * Estructura de 64 bits:
 * - 1 bit de signo (siempre 0)
 * - 41 bits: milisegundos desde DISCORD_EPOCH (2015-01-01)
 * - 5 bits: Worker ID (0-31)
 * - 5 bits: Process ID (0-31)
 * - 12 bits: Secuencia incremental (0-4095)
 */
export class SnowflakeGenerator {
  public static readonly DISCORD_EPOCH = 1420070400000n; // 2015-01-01T00:00:00.000Z
  private sequence = 0n;
  private lastTimestamp = -1n;

  constructor(
    private readonly workerId: bigint = 1n,
    private readonly processId: bigint = 1n
  ) {
    if (workerId > 31n || processId > 31n) {
      throw new Error('WorkerId y ProcessId no pueden exceder 31 (5 bits)');
    }
  }

  public nextId(): string {
    let timestamp = BigInt(Date.now()) - SnowflakeGenerator.DISCORD_EPOCH;

    // Protección contra retrocesos leves de reloj o desbordamiento en el mismo ms
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & 4095n;
      if (this.sequence === 0n) {
        // Desbordamiento: esperar activamente al siguiente milisegundo
        while (timestamp <= this.lastTimestamp) {
          timestamp = BigInt(Date.now()) - SnowflakeGenerator.DISCORD_EPOCH;
        }
      }
    } else if (timestamp < this.lastTimestamp) {
      // Si el reloj retrocede levemente por ajuste NTP
      timestamp = this.lastTimestamp;
      this.sequence = (this.sequence + 1n) & 4095n;
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const id =
      (timestamp << 22n) |
      (this.workerId << 17n) |
      (this.processId << 12n) |
      this.sequence;

    return id.toString();
  }

  public static getTimestamp(snowflake: string): Date {
    const id = BigInt(snowflake);
    const ms = (id >> 22n) + SnowflakeGenerator.DISCORD_EPOCH;
    return new Date(Number(ms));
  }
}

export const defaultSnowflake = new SnowflakeGenerator(1n, 1n);
