// Synthesised engine rumble (no audio files): low-passed brown noise for the roar,
// band-passed white noise for crackle, and a short burst for the ignition pop.

type Nodes = {
  ctx: AudioContext
  roar: GainNode
  tone: BiquadFilterNode
  crackle: GainNode
}

function noiseBuffer(ctx: AudioContext, seconds: number, brown: boolean) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = brown ? last * 3.5 : white
  }
  return buffer
}

function loop(ctx: AudioContext, buffer: AudioBuffer, ...chain: AudioNode[]) {
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  chain.reduce<AudioNode>((from, to) => from.connect(to), source).connect(ctx.destination)
  source.start()
}

function build(): Nodes | null {
  const Context = window.AudioContext
  if (!Context) return null
  const ctx = new Context()
  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 160
  const roar = ctx.createGain()
  roar.gain.value = 0
  loop(ctx, noiseBuffer(ctx, 3, true), tone, roar)

  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2600
  band.Q.value = 0.7
  const crackle = ctx.createGain()
  crackle.gain.value = 0
  loop(ctx, noiseBuffer(ctx, 2, false), band, crackle)
  return { ctx, roar, tone, crackle }
}

class Rumble {
  private nodes: Nodes | null = null

  private ensure() {
    this.nodes ??= build()
    if (this.nodes?.ctx.state === 'suspended') void this.nodes.ctx.resume()
    return this.nodes
  }

  /** Call every frame with the current throttle (0–1). */
  level(throttle: number) {
    const nodes = throttle > 0.001 ? this.ensure() : this.nodes
    if (!nodes) return
    const now = nodes.ctx.currentTime
    nodes.roar.gain.setTargetAtTime(throttle * 0.85, now, 0.08)
    nodes.tone.frequency.setTargetAtTime(160 + throttle * 1100, now, 0.12)
    nodes.crackle.gain.setTargetAtTime(throttle * (0.02 + Math.random() * 0.06), now, 0.02)
  }

  pop() {
    const nodes = this.ensure()
    if (!nodes) return
    const { ctx } = nodes
    const source = ctx.createBufferSource()
    source.buffer = noiseBuffer(ctx, 0.35, false)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.7, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()
  }

  silence() {
    this.level(0)
  }
}

export const rumble = new Rumble()
