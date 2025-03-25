document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const container = document.querySelector('.sections-container');
  let currentSectionIndex = 0;
  let isAnimating = false;

  function scrollToSection(index) {
    isAnimating = true;
    const offset = -index * window.innerHeight;
  
    // 添加缩放类和折叠效果类
    container.classList.add('scale-down', 'fold-effect');
  
    // 延迟一段时间后执行滚动，以配合缩放和折叠动画
    setTimeout(() => {
      container.style.transform = `translateY(${offset}px)`;
    }, 250); // 250ms 为动画时间的一半
  
    // 在过渡结束后移除缩放类和折叠效果类
    setTimeout(() => {
      container.classList.remove('scale-down', 'fold-effect');
      isAnimating = false;
    }, 500); // 与 CSS 中的过渡时间匹配
  }

  window.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    if (e.deltaY > 0) {
      // 向下滚动
      if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        scrollToSection(currentSectionIndex);
      }
    } else {
      // 向上滚动
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
        scrollToSection(currentSectionIndex);
      }
    }
  });

  // 处理窗口大小调整
  window.addEventListener('resize', () => {
    scrollToSection(currentSectionIndex);
  });

  // 新增线条动画逻辑
  const initLineAnimation = () => {
    const content2 = document.getElementById('content2');
    if (!content2 || content2.dataset.initialized) return;
    content2.dataset.initialized = true;

  // 创建线条容器
  const lineContainer = document.createElement('div');
  lineContainer.id = 'line-container';
  content2.appendChild(lineContainer);

  // 创建固定边框
  ['top', 'bottom', 'left', 'right'].forEach(pos => {
    const line = document.createElement('div');
    line.className = `line border ${pos}`;
    lineContainer.appendChild(line);
    
    // 定位设置
    if (pos === 'top' || pos === 'bottom') {
      line.style.height = '2px';
      line.style.left = '0';
      line.style.right = '0';
      line.style[pos] = '0';
    } else {
      line.style.width = '2px';
      line.style.top = '0';
      line.style.bottom = '0';
      line.style[pos] = '0';
    }
  });
  
  // 创建动态内部线条
  const lines = [];
  function createInnerLines() {
    const lineCount = 24;  // 增加线条密度
    
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'line inner';
      
      // 增强随机参数
      const isVertical = Math.random() > 0.5;
      const pos = Math.random() * 100;
      const length = 80 + Math.random() * 20;  // 增加长度
      
      Object.assign(line.style, {
        [isVertical ? 'width' : 'height']: '1px',
        [isVertical ? 'left' : 'top']: `${pos}%`,
        [isVertical ? 'height' : 'width']: `${length}%`,
        transformOrigin: isVertical ? 'center center' : 'center center'
      });
      
      // 添加随机颜色
      line.style.background = `hsl(${Math.random()*360}, 70%, 60%)`;
      
      lineContainer.appendChild(line);
      lines.push({
        element: line,
        speed: Math.random() * 0.8 + 0.2,  // 增加速度变化
        direction: Math.random() > 0.5 ? 1 : -1,
        waveFactor: Math.random() * 2 + 1   // 新增波动系数
      });
    }
  }
  
  // 增强动画效果
  function animate() {
    const time = Date.now() * 0.001;
    
    lines.forEach(line => {
      const wave = Math.sin(time * line.speed) * 25 * line.waveFactor;
      const rotate = Math.cos(time * line.speed * 0.6) * 35 * line.direction;
      const scale = 1 + Math.sin(time * line.speed) * 0.2;
      
      line.element.style.transform = `
        perspective(1000px)
        rotateZ(${rotate}deg)
        translateZ(${wave}px)
        scale(${scale})
      `;
    });
  
    requestAnimationFrame(animate);
  }
  
  createInnerLines();
    // 启动动画
    animate();
  }

  // 初始化执行
  initLineAnimation();
});






document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('content1-2');
  const fullText = `HBPU's laboratory
On the direction of artificial intelligence technology 
and embedded and intelligent scientific computing`;
  const words = fullText.replace(/\n/g, ' ').split(/\s+/);
  
  // 配置参数
  const config = {
    wordsPerLine: 6,    // 每行单词数
    addInterval: 50,    // 单词间隔
    letterInterval: 20, // 字母间隔
    restartDelay: 5000  // 重新播放前的等待时间
  };

  // 初始化状态
  let currentIndex = 0;
  let currentLine = [];
  let cachedLines = [];

  // 字母动画
  function displayWord(word, onComplete) {
    let displayed = "";
    for (let i = 0; i < word.length; i++) {
      setTimeout(() => {
        displayed += word[i];
        currentLine[currentLine.length - 1] = displayed;
        render();
        if (i === word.length - 1) onComplete();
      }, config.letterInterval * i);
    }
  }

  // 渲染内容
  function render() {
    container.innerHTML = [...cachedLines, currentLine.join(' ')].join('<br>');
  }

  // 主流程
  function addWord() {
    if (currentIndex >= words.length) {
      // 全部显示完成后重置
      setTimeout(resetAndRestart, config.restartDelay);
      return;
    }

    currentLine.push(""); // 占位符
    const word = words[currentIndex];

    displayWord(word, () => {
      currentIndex++;
      
      // 换行判断
      if (currentLine.length === config.wordsPerLine || currentIndex === words.length) {
        cachedLines.push(currentLine.join(' '));
        currentLine = [];
      }
      
      // 继续下一个单词
      setTimeout(addWord, config.addInterval);
    });
  }

  // 重置并重新开始
  function resetAndRestart() {
    // 清空所有状态
    currentIndex = 0;
    currentLine = [];
    cachedLines = [];
    container.innerHTML = '';
    
    // 重新开始
    addWord();
  }

  // 初始启动
  addWord();
});