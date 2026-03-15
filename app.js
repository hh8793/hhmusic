// 主应用逻辑

// 全局变量
let currentSection = 'learn';
let currentNote = null;
let score = 0;
let rhythmInterval = null;
let isRhythmPlaying = false;
let currentBeat = 1;
let rhythmPattern = '44';
let tempo = 80;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTempoControl();
    initPatternButtons();
    initKeyboardShortcuts();
});

// 导航功能
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // 隐藏所有章节
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    
    // 移除所有导航按钮的激活状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的章节
    document.getElementById(section).classList.add('active');
    
    // 激活对应的导航按钮
    document.querySelector(`.nav-btn[data-section="${section}"]`).classList.add('active');
    
    currentSection = section;
    
    // 如果离开节奏练习，停止播放
    if (section !== 'rhythm' && isRhythmPlaying) {
        toggleRhythm();
    }
}

// 知识学习功能
function showNoteDetail() {
    const content = `
        <h3>🎼 认识音符</h3>
        <p>音乐中有7个基本音符，每个音符都有自己的音高：</p>
        <div class="note-list">
            <div class="note-item">
                <span class="note-name">Do (C)</span>
                <button class="play-mini-btn" onclick="playNote('C')">▶️</button>
                <span class="note-desc">第一个音符，最低音</span>
            </div>
            <div class="note-item">
                <span class="note-name">Re (D)</span>
                <button class="play-mini-btn" onclick="playNote('D')">▶️</button>
                <span class="note-desc">比 Do 高一个音</span>
            </div>
            <div class="note-item">
                <span class="note-name">Mi (E)</span>
                <button class="play-mini-btn" onclick="playNote('E')">▶️</button>
                <span class="note-desc">欢快的音符</span>
            </div>
            <div class="note-item">
                <span class="note-name">Fa (F)</span>
                <button class="play-mini-btn" onclick="playNote('F')">▶️</button>
                <span class="note-desc">温和的音符</span>
            </div>
            <div class="note-item">
                <span class="note-name">Sol (G)</span>
                <button class="play-mini-btn" onclick="playNote('G')">▶️</button>
                <span class="note-desc">稳定的音符</span>
            </div>
            <div class="note-item">
                <span class="note-name">La (A)</span>
                <button class="play-mini-btn" onclick="playNote('A')">▶️</button>
                <span class="note-desc">明亮的音符</span>
            </div>
            <div class="note-item">
                <span class="note-name">Si (B)</span>
                <button class="play-mini-btn" onclick="playNote('B')">▶️</button>
                <span class="note-desc">最高的音符</span>
            </div>
        </div>
        <p class="tip">💡 点击播放按钮可以听到每个音符的声音！</p>
    `;
    
    document.getElementById('noteContent').innerHTML = content;
    document.getElementById('noteDisplay').classList.remove('hidden');
}

function showDurationDetail() {
    const content = `
        <h3>⏱️ 音符时长</h3>
        <p>音符的时长决定了音符要唱多久：</p>
        <div class="duration-list">
            <div class="duration-item">
                <div class="duration-symbol">𝅝</div>
                <div class="duration-info">
                    <strong>全音符</strong>
                    <p>唱 4 拍，最长</p>
                </div>
            </div>
            <div class="duration-item">
                <div class="duration-symbol">𝅗𝅥</div>
                <div class="duration-info">
                    <strong>二分音符</strong>
                    <p>唱 2 拍，是全音符的一半</p>
                </div>
            </div>
            <div class="duration-item">
                <div class="duration-symbol">♩</div>
                <div class="duration-info">
                    <strong>四分音符</strong>
                    <p>唱 1 拍，最常用的音符</p>
                </div>
            </div>
            <div class="duration-item">
                <div class="duration-symbol">♪</div>
                <div class="duration-info">
                    <strong>八分音符</strong>
                    <p>唱 0.5 拍，很快</p>
                </div>
            </div>
        </div>
        <p class="tip">💡 音符下方有一条横线，表示唱的时间减半！</p>
    `;
    
    document.getElementById('noteContent').innerHTML = content;
    document.getElementById('noteDisplay').classList.remove('hidden');
}

function showClefDetail() {
    const content = `
        <h3>🎵 认识谱号</h3>
        <p>谱号告诉我们每个音符应该在五线谱的哪里：</p>
        <div class="clef-list">
            <div class="clef-item">
                <div class="clef-symbol">𝄞</div>
                <div class="clef-info">
                    <strong>高音谱号</strong>
                    <p>也叫 G 谱号，用于高音部分</p>
                    <p>主要乐器：小提琴、笛子、女声</p>
                </div>
            </div>
            <div class="clef-item">
                <div class="clef-symbol">𝄢</div>
                <div class="clef-info">
                    <strong>低音谱号</strong>
                    <p>也叫 F 谱号，用于低音部分</p>
                    <p>主要乐器：大提琴、钢琴左手、男低音</p>
                </div>
            </div>
        </div>
        <div class="staff-example">
            <p>五线谱有 5 条线 4 个间：</p>
            <div class="staff-lines">
                <span class="line">────────</span>
                <span class="line">────────</span>
                <span class="line">────────</span>
                <span class="line">────────</span>
                <span class="line">────────</span>
            </div>
        </div>
        <p class="tip">💡 从下往上数：第 1 线是 E，第 2 线是 G，第 3 线是 B...</p>
    `;
    
    document.getElementById('noteContent').innerHTML = content;
    document.getElementById('noteDisplay').classList.remove('hidden');
}

function closeDisplay() {
    document.getElementById('noteDisplay').classList.add('hidden');
}

function playNote(note) {
    audioUtils.playNote(note, 0.5);
}

// 识谱练习功能
function playRandomNote() {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    currentNote = notes[Math.floor(Math.random() * notes.length)];
    audioUtils.playNote(currentNote, 0.8);
    
    // 清除之前的反馈
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // 清除按钮状态
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });
}

function checkAnswer(answer) {
    if (!currentNote) {
        document.getElementById('feedback').textContent = '请先点击"播放音符"按钮！';
        document.getElementById('feedback').className = 'feedback error';
        return;
    }
    
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.answer-btn');
    
    // 找到对应的按钮
    const selectedButton = Array.from(buttons).find(btn => btn.getAttribute('data-note') === answer);
    const correctButton = Array.from(buttons).find(btn => btn.getAttribute('data-note') === currentNote);
    
    if (answer === currentNote) {
        // 回答正确
        score += 10;
        document.getElementById('score').textContent = score;
        feedback.textContent = `🎉 太棒了！答案是 ${audioUtils.getNoteName(currentNote)}！+10分`;
        feedback.className = 'feedback success';
        selectedButton.classList.add('correct');
    } else {
        // 回答错误
        score = Math.max(0, score - 5);
        document.getElementById('score').textContent = score;
        feedback.textContent = `😢 再试一次！正确答案是 ${audioUtils.getNoteName(currentNote)}`;
        feedback.className = 'feedback error';
        selectedButton.classList.add('wrong');
        correctButton.classList.add('correct');
    }
    
    currentNote = null;
}

// 节奏练习功能
function initTempoControl() {
    const tempoSlider = document.getElementById('tempo');
    const tempoValue = document.getElementById('tempoValue');
    
    tempoSlider.addEventListener('input', function() {
        tempo = parseInt(this.value);
        tempoValue.textContent = `${tempo} BPM`;
        
        // 如果正在播放，重新启动以应用新的速度
        if (isRhythmPlaying) {
            toggleRhythm();
            setTimeout(() => toggleRhythm(), 100);
        }
    });
}

function initPatternButtons() {
    const patternButtons = document.querySelectorAll('.pattern-btn');
    
    patternButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            patternButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            rhythmPattern = this.getAttribute('data-pattern');
            
            // 更新视觉器显示的拍数
            updateRhythmVisualizer();
            
            // 如果正在播放，重新启动
            if (isRhythmPlaying) {
                toggleRhythm();
                setTimeout(() => toggleRhythm(), 100);
            }
        });
    });
}

function updateRhythmVisualizer() {
    const visualizer = document.querySelector('.rhythm-visualizer');
    const beatCount = parseInt(rhythmPattern[0]);
    
    // 清除现有的拍子
    visualizer.innerHTML = '';
    
    // 创建新的拍子
    for (let i = 1; i <= beatCount; i++) {
        const beat = document.createElement('div');
        beat.className = 'beat';
        beat.id = `beat${i}`;
        beat.textContent = i;
        visualizer.appendChild(beat);
    }
}

function toggleRhythm() {
    const btn = document.getElementById('rhythmStartBtn');
    
    if (isRhythmPlaying) {
        // 停止播放
        clearInterval(rhythmInterval);
        isRhythmPlaying = false;
        btn.textContent = '▶️ 开始';
        btn.classList.remove('playing');
        
        // 重置视觉器
        document.querySelectorAll('.beat').forEach(beat => {
            beat.classList.remove('active');
        });
    } else {
        // 开始播放
        isRhythmPlaying = true;
        btn.textContent = '⏸️ 暂停';
        btn.classList.add('playing');
        currentBeat = 1;
        
        // 立即播放第一拍
        playBeat(currentBeat);
        
        // 设置定时器
        const intervalTime = (60 / tempo) * 1000;
        rhythmInterval = setInterval(() => {
            currentBeat++;
            const beatCount = parseInt(rhythmPattern[0]);
            if (currentBeat > beatCount) {
                currentBeat = 1;
            }
            playBeat(currentBeat);
        }, intervalTime);
    }
}

function playBeat(beat) {
    // 移除所有拍子的激活状态
    document.querySelectorAll('.beat').forEach(b => {
        b.classList.remove('active');
    });
    
    // 激活当前拍子
    const currentBeatElement = document.getElementById(`beat${beat}`);
    if (currentBeatElement) {
        currentBeatElement.classList.add('active');
    }
    
    // 播放声音（第一拍是强拍）
    const isStrongBeat = beat === 1;
    audioUtils.playDrum(isStrongBeat);
}

// 虚拟钢琴功能
function playPianoNote(note) {
    audioUtils.playNote(note, 0.6);
    
    // 添加按键动画
    const key = document.querySelector(`[data-note="${note}"]`);
    if (key) {
        key.style.transform = 'translateY(3px)';
        setTimeout(() => {
            key.style.transform = '';
        }, 100);
    }
}

// 键盘快捷键功能
function initKeyboardShortcuts() {
    const keyMap = {
        'a': 'C4',
        's': 'D4',
        'd': 'E4',
        'f': 'F4',
        'g': 'G4',
        'h': 'A4',
        'j': 'B4',
        'k': 'C5'
    };
    
    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        
        // 如果当前在钢琴页面，播放对应的音符
        if (currentSection === 'piano' && keyMap[key]) {
            playPianoNote(keyMap[key]);
            
            // 添加按键视觉效果
            const note = keyMap[key];
            const pianoKey = document.querySelector(`[data-note="${note}"]`);
            if (pianoKey) {
                pianoKey.style.background = note.includes('#') ? 
                    'linear-gradient(180deg, #222 0%, #000 100%)' : 
                    'linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%)';
            }
        }
        
        // 空格键切换节奏播放
        if (currentSection === 'rhythm' && e.code === 'Space') {
            e.preventDefault();
            toggleRhythm();
        }
    });
    
    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();
        
        if (currentSection === 'piano' && keyMap[key]) {
            const note = keyMap[key];
            const pianoKey = document.querySelector(`[data-note="${note}"]`);
            if (pianoKey) {
                pianoKey.style.background = '';
            }
        }
    });
}

// 添加动态样式
const dynamicStyles = `
    <style>
        .note-list {
            margin: 20px 0;
        }
        
        .note-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .note-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        
        .note-name {
            flex: 1;
            font-weight: bold;
            font-size: 1.1em;
            color: #667eea;
        }
        
        .play-mini-btn {
            padding: 8px 15px;
            margin: 0 15px;
            border: none;
            border-radius: 5px;
            background: #667eea;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .play-mini-btn:hover {
            background: #5568d3;
            transform: scale(1.1);
        }
        
        .note-desc {
            flex: 2;
            color: #636e72;
        }
        
        .duration-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .duration-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .duration-item:hover {
            background: #e9ecef;
            transform: translateY(-5px);
        }
        
        .duration-symbol {
            font-size: 3em;
            margin-bottom: 15px;
            color: #f5576c;
        }
        
        .duration-info strong {
            display: block;
            color: #2d3436;
            margin-bottom: 5px;
        }
        
        .duration-info p {
            color: #636e72;
            font-size: 0.9em;
        }
        
        .clef-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .clef-item {
            background: linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%);
            padding: 25px;
            border-radius: 15px;
            border: 2px solid #ffdae1;
            transition: all 0.3s ease;
        }
        
        .clef-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .clef-symbol {
            font-size: 4em;
            text-align: center;
            margin-bottom: 15px;
            color: #f5576c;
        }
        
        .clef-info strong {
            display: block;
            color: #2d3436;
            margin-bottom: 10px;
            font-size: 1.2em;
        }
        
        .clef-info p {
            color: #636e72;
            margin: 5px 0;
        }
        
        .staff-example {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .staff-example p {
            color: #2d3436;
            margin-bottom: 15px;
        }
        
        .staff-lines {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .staff-lines .line {
            width: 100%;
            height: 2px;
            background: #2d3436;
        }
        
        .tip {
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
            padding: 15px;
            border-radius: 10px;
            color: #2d3436;
            margin-top: 20px;
            text-align: center;
            font-weight: 500;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);
