// 音频工具模块 - 用于生成和播放音乐音符

class AudioUtils {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.noteFrequencies = {
            'C4': 261.63,
            'C#4': 277.18,
            'D4': 293.66,
            'D#4': 311.13,
            'E4': 329.63,
            'F4': 349.23,
            'F#4': 369.99,
            'G4': 392.00,
            'G#4': 415.30,
            'A4': 440.00,
            'A#4': 466.16,
            'B4': 493.88,
            'C5': 523.25,
            'C': 261.63,  // 中音 Do
            'D': 293.66,  // 中音 Re
            'E': 329.63,  // 中音 Mi
            'F': 349.23,  // 中音 Fa
            'G': 392.00,  // 中音 Sol
            'A': 440.00,  // 中音 La
            'B': 493.88   // 中音 Si
        };
    }

    // 初始化音频上下文
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.5; // 设置主音量
        }
        return this.audioContext;
    }

    // 播放音符（钢琴音色）
    playNote(note, duration = 0.5, time = 0) {
        const context = this.init();
        const frequency = this.noteFrequencies[note];
        
        if (!frequency) {
            console.error(`未找到音符 ${note} 的频率`);
            return;
        }

        const startTime = time || context.currentTime;
        
        // 创建振荡器（钢琴音色使用多个振荡器）
        const oscillator1 = context.createOscillator();
        const oscillator2 = context.createOscillator();
        const oscillator3 = context.createOscillator();

        // 设置振荡器类型
        oscillator1.type = 'triangle';
        oscillator2.type = 'sine';
        oscillator3.type = 'sine';

        // 设置频率（略微失谐模拟真实钢琴）
        oscillator1.frequency.setValueAtTime(frequency, startTime);
        oscillator2.frequency.setValueAtTime(frequency, startTime);
        oscillator3.frequency.setValueAtTime(frequency * 2, startTime); // 泛音

        // 创建增益节点
        const gainNode1 = context.createGain();
        const gainNode2 = context.createGain();
        const gainNode3 = context.createGain();

        // 设置音量包络（模拟钢琴的起音和衰减）
        const attackTime = 0.01;
        const decayTime = 0.3;
        const sustainLevel = 0.5;
        const releaseTime = 0.3;

        // 振荡器 1（基础音）
        gainNode1.gain.setValueAtTime(0, startTime);
        gainNode1.gain.linearRampToValueAtTime(0.5, startTime + attackTime);
        gainNode1.gain.linearRampToValueAtTime(sustainLevel * 0.6, startTime + attackTime + decayTime);
        gainNode1.gain.linearRampToValueAtTime(0, startTime + duration + releaseTime);

        // 振荡器 2（基础音）
        gainNode2.gain.setValueAtTime(0, startTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, startTime + attackTime);
        gainNode2.gain.linearRampToValueAtTime(sustainLevel * 0.4, startTime + attackTime + decayTime);
        gainNode2.gain.linearRampToValueAtTime(0, startTime + duration + releaseTime);

        // 振荡器 3（泛音）
        gainNode3.gain.setValueAtTime(0, startTime);
        gainNode3.gain.linearRampToValueAtTime(0.15, startTime + attackTime);
        gainNode3.gain.linearRampToValueAtTime(sustainLevel * 0.2, startTime + attackTime + decayTime);
        gainNode3.gain.linearRampToValueAtTime(0, startTime + duration + releaseTime);

        // 连接节点
        oscillator1.connect(gainNode1);
        oscillator2.connect(gainNode2);
        oscillator3.connect(gainNode3);
        
        gainNode1.connect(this.masterGain);
        gainNode2.connect(this.masterGain);
        gainNode3.connect(this.masterGain);

        // 开始和停止振荡器
        oscillator1.start(startTime);
        oscillator1.stop(startTime + duration + releaseTime);
        
        oscillator2.start(startTime);
        oscillator2.stop(startTime + duration + releaseTime);
        
        oscillator3.start(startTime);
        oscillator3.stop(startTime + duration + releaseTime);
    }

    // 播放鼓声（节拍器）
    playDrum(strong = false, time = 0) {
        const context = this.init();
        const startTime = time || context.currentTime;
        
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        // 强拍使用更低频率
        oscillator.frequency.setValueAtTime(strong ? 150 : 300, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, startTime + 0.05);
        
        // 音量包络
        gainNode.gain.setValueAtTime(strong ? 0.8 : 0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.05);
    }

    // 播放和弦
    playChord(notes, duration = 1) {
        notes.forEach(note => {
            this.playNote(note, duration);
        });
    }

    // 播放简单的旋律
    playMelody(notes, tempo = 120) {
        const context = this.init();
        const beatDuration = 60 / tempo;
        
        notes.forEach((note, index) => {
            const time = context.currentTime + index * beatDuration;
            this.playNote(note, beatDuration * 0.9, time);
        });
    }

    // 设置主音量
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = value;
        }
    }

    // 获取音符名称（中文）
    getNoteName(note) {
        const noteNames = {
            'C': 'Do',
            'D': 'Re',
            'E': 'Mi',
            'F': 'Fa',
            'G': 'Sol',
            'A': 'La',
            'B': 'Si'
        };
        return noteNames[note] || note;
    }
}

// 创建全局音频工具实例
const audioUtils = new AudioUtils();
