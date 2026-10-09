/**
 * Orhan Luxury Web Audio API Sound Synthesizer
 * Zero external audio dependencies - 100% reliable, zero latency, pure synthesized acoustic feedback.
 */

class OrhanAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isAmbientPlaying = false;
    this.ambientNodes = null;
    this.volume = 0.6;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Toggle ambient fire crackle / sizzle
  toggleAmbient() {
    this.init();
    if (!this.ctx) return false;

    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    if (!this.ctx || this.isAmbientPlaying) return;
    this.init();

    // Create a continuous pink-noise buffer with bandpass filtering to emulate wood ember crackle and gentle grill sizzle
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like soft charcoal sizzle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08 * this.volume, this.ctx.currentTime + 1.5);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();

    // Random ember pops timer
    const popInterval = setInterval(() => {
      if (!this.isAmbientPlaying) {
        clearInterval(popInterval);
        return;
      }
      if (Math.random() > 0.4) {
        this.playEmberPop();
      }
    }, 450);

    this.ambientNodes = { whiteNoise, filter, gainNode, popInterval };
    this.isAmbientPlaying = true;
  }

  stopAmbient() {
    if (!this.ambientNodes) return;
    const { whiteNoise, gainNode, popInterval } = this.ambientNodes;
    clearInterval(popInterval);
    if (gainNode && this.ctx) {
      gainNode.gain.setValueAtTime(gainNode.gain.value, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        try { whiteNoise.stop(); } catch (e) {}
      }, 850);
    }
    this.ambientNodes = null;
    this.isAmbientPlaying = false;
  }

  playEmberPop() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const freq = 600 + Math.random() * 1400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.3, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.03 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Tactile micro-haptic click (mechanical luxury watch button feel)
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  // Juicy Ingredient Drop (burger customization stack layer)
  playIngredientDrop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.14);

      gain.gain.setValueAtTime(0.22 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + 0.15);
    } catch (e) {}
  }

  // Flame sear / sizzle burst (when adjusting heat or grilling)
  playSizzleBurst(intensity = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const dur = 0.35 * intensity;
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18 * this.volume * intensity, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Add To Cart Chime (Pentatonic harmonic shimmer)
  playAddToCart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const t = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);

        gain.gain.setValueAtTime(0.12 * this.volume, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.36);
      });
    } catch (e) {}
  }

  // VIP Order Placed Celebration Fanfare
  playOrderSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const chords = [
        { freqs: [440, 554.37, 659.25], start: 0, dur: 0.2 },
        { freqs: [493.88, 622.25, 739.99], start: 0.18, dur: 0.2 },
        { freqs: [587.33, 739.99, 880], start: 0.36, dur: 0.4 },
        { freqs: [880, 1108.73, 1318.51, 1760], start: 0.60, dur: 0.8 }
      ];
      const baseTime = this.ctx.currentTime;
      chords.forEach(c => {
        c.freqs.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, baseTime + c.start);

          gain.gain.setValueAtTime(0.09 * this.volume, baseTime + c.start);
          gain.gain.exponentialRampToValueAtTime(0.0001, baseTime + c.start + c.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(baseTime + c.start);
          osc.stop(baseTime + c.start + c.dur);
        });
      });
    } catch (e) {}
  }
}

window.orhanAudio = new OrhanAudioEngine();
