// Генерация уникального fingerprint устройства
export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL(),
    webgl: getWebGLFingerprint(),
    fonts: getFontList(),
    plugins: getPluginList(),
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints,
  };

  return btoa(JSON.stringify(fingerprint));
};

// Получение WebGL fingerprint
const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    return {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
    };
  } catch (e) {
    return null;
  }
};

// Получение списка шрифтов
const getFontList = () => {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const fontList = [
    'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Impact'
  ];

  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const h = document.getElementsByTagName('body')[0];

  const baseFontsWidth = {};
  const fontWidths = {};

  for (const baseFont of baseFonts) {
    const s = document.createElement('span');
    s.style.fontSize = testSize;
    s.style.fontFamily = baseFont;
    s.innerHTML = testString;
    h.appendChild(s);
    baseFontsWidth[baseFont] = s.offsetWidth;
    h.removeChild(s);
  }

  for (const font of fontList) {
    let detected = false;
    for (const baseFont of baseFonts) {
      const s = document.createElement('span');
      s.style.fontSize = testSize;
      s.style.fontFamily = `${font},${baseFont}`;
      s.innerHTML = testString;
      h.appendChild(s);
      const matched = s.offsetWidth !== baseFontsWidth[baseFont];
      h.removeChild(s);
      detected = detected || matched;
    }
    if (detected) {
      fontWidths[font] = true;
    }
  }

  return fontWidths;
};

// Получение списка плагинов
const getPluginList = () => {
  const plugins = [];
  for (let i = 0; i < navigator.plugins.length; i++) {
    plugins.push(navigator.plugins[i].name);
  }
  return plugins;
};

// Анализ поведения пользователя
export class BehaviorAnalyzer {
  constructor() {
    this.mouseMovements = [];
    this.keyStrokes = [];
    this.clickPatterns = [];
    this.scrollPatterns = [];
    this.startTime = Date.now();
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Отслеживание движений мыши
    document.addEventListener('mousemove', (e) => {
      this.mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now() - this.startTime,
      });
    });

    // Отслеживание кликов
    document.addEventListener('click', (e) => {
      this.clickPatterns.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now() - this.startTime,
        target: e.target.tagName,
      });
    });

    // Отслеживание нажатий клавиш
    document.addEventListener('keydown', (e) => {
      this.keyStrokes.push({
        key: e.key,
        timestamp: Date.now() - this.startTime,
        interval: this.keyStrokes.length > 0 
          ? Date.now() - this.startTime - this.keyStrokes[this.keyStrokes.length - 1].timestamp 
          : 0,
      });
    });

    // Отслеживание прокрутки
    document.addEventListener('scroll', (e) => {
      this.scrollPatterns.push({
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        timestamp: Date.now() - this.startTime,
      });
    });
  }

  // Анализ паттернов движений мыши
  analyzeMouseMovements() {
    if (this.mouseMovements.length < 10) return null;

    const movements = this.mouseMovements.slice(-50); // Последние 50 движений
    const velocities = [];
    const accelerations = [];

    for (let i = 1; i < movements.length; i++) {
      const prev = movements[i - 1];
      const curr = movements[i];
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      const time = curr.timestamp - prev.timestamp;
      const velocity = time > 0 ? distance / time : 0;
      velocities.push(velocity);

      if (i > 1) {
        const prevVelocity = velocities[velocities.length - 2];
        const acceleration = time > 0 ? (velocity - prevVelocity) / time : 0;
        accelerations.push(acceleration);
      }
    }

    return {
      averageVelocity: velocities.reduce((a, b) => a + b, 0) / velocities.length,
      velocityVariance: this.calculateVariance(velocities),
      averageAcceleration: accelerations.length > 0 
        ? accelerations.reduce((a, b) => a + b, 0) / accelerations.length 
        : 0,
      accelerationVariance: this.calculateVariance(accelerations),
    };
  }

  // Анализ паттернов кликов
  analyzeClickPatterns() {
    if (this.clickPatterns.length < 5) return null;

    const clicks = this.clickPatterns.slice(-20);
    const intervals = [];

    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
    }

    return {
      averageInterval: intervals.reduce((a, b) => a + b, 0) / intervals.length,
      intervalVariance: this.calculateVariance(intervals),
      clickTargets: clicks.map(c => c.target),
    };
  }

  // Анализ паттернов нажатий клавиш
  analyzeKeyStrokes() {
    if (this.keyStrokes.length < 10) return null;

    const strokes = this.keyStrokes.slice(-50);
    const intervals = strokes.map(s => s.interval).filter(i => i > 0);

    return {
      averageInterval: intervals.reduce((a, b) => a + b, 0) / intervals.length,
      intervalVariance: this.calculateVariance(intervals),
      commonKeys: this.getMostCommon(strokes.map(s => s.key)),
    };
  }

  // Вычисление дисперсии
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  // Получение наиболее частых значений
  getMostCommon(values) {
    const counts = {};
    values.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([key, count]) => ({ key, count }));
  }

  // Полный анализ поведения
  getBehaviorAnalysis() {
    return {
      mouseMovements: this.analyzeMouseMovements(),
      clickPatterns: this.analyzeClickPatterns(),
      keyStrokes: this.analyzeKeyStrokes(),
      sessionDuration: Date.now() - this.startTime,
      totalEvents: this.mouseMovements.length + this.clickPatterns.length + this.keyStrokes.length,
    };
  }

  // Оценка вероятности того, что пользователь является ботом
  getBotProbability() {
    const analysis = this.getBehaviorAnalysis();
    let score = 0;

    // Проверка движений мыши
    if (analysis.mouseMovements) {
      const { averageVelocity, velocityVariance, averageAcceleration } = analysis.mouseMovements;
      
      // Слишком прямолинейные движения
      if (velocityVariance < 100) score += 20;
      
      // Слишком равномерная скорость
      if (Math.abs(averageAcceleration) < 0.1) score += 15;
      
      // Слишком быстрые движения
      if (averageVelocity > 1000) score += 10;
    }

    // Проверка кликов
    if (analysis.clickPatterns) {
      const { averageInterval, intervalVariance } = analysis.clickPatterns;
      
      // Слишком равномерные интервалы
      if (intervalVariance < 100) score += 25;
      
      // Слишком быстрые клики
      if (averageInterval < 100) score += 15;
    }

    // Проверка нажатий клавиш
    if (analysis.keyStrokes) {
      const { averageInterval, intervalVariance } = analysis.keyStrokes;
      
      // Слишком равномерные интервалы
      if (intervalVariance < 50) score += 20;
      
      // Слишком быстрые нажатия
      if (averageInterval < 50) score += 10;
    }

    // Общие проверки
    if (analysis.totalEvents < 10) score += 30; // Слишком мало активности
    if (analysis.sessionDuration < 5000) score += 20; // Слишком короткая сессия

    return Math.min(score, 100); // Возвращаем процент вероятности (0-100)
  }
}

// Проверка на автоматизированные действия
export const detectAutomation = () => {
  const automationSigns = [];

  // Проверка на WebDriver
  if (navigator.webdriver) {
    automationSigns.push('WebDriver detected');
  }

  // Проверка на PhantomJS
  if (navigator.userAgent.includes('PhantomJS')) {
    automationSigns.push('PhantomJS detected');
  }

  // Проверка на Selenium
  if (window.callSelenium || window._selenium) {
    automationSigns.push('Selenium detected');
  }

  // Проверка на Puppeteer
  if (navigator.userAgent.includes('HeadlessChrome')) {
    automationSigns.push('Headless Chrome detected');
  }

  // Проверка на отсутствие плагинов (характерно для ботов)
  if (navigator.plugins.length === 0) {
    automationSigns.push('No plugins detected');
  }

  // Проверка на отсутствие языков
  if (navigator.languages.length === 0) {
    automationSigns.push('No languages detected');
  }

  return {
    isAutomated: automationSigns.length > 0,
    signs: automationSigns,
  };
};

// Основная функция проверки
export const performAntiBotCheck = () => {
  const deviceFingerprint = generateDeviceFingerprint();
  const automationCheck = detectAutomation();
  
  return {
    deviceFingerprint,
    automationCheck,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};
