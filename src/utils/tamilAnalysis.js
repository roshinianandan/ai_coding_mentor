// ============================================================
//  tamilAnalysis.js — Tamil translations of analysis content
//  + bullet-point explanations per difficulty level
// ============================================================

// Bullet-point explanations keyed by mistake index + level
export const TAMIL_ANALYSES = [
  // 0 — binary search boundary
  {
    mistake: 'இரும தேடல் வரம்பு தவறாக அமைக்கப்பட்டது',
    explanation: {
      beginner: [
        'right = arr.length என்பது தவறு',
        'arr.length - 1 என்று வைக்க வேண்டும்',
        'கடைசி index எப்போதும் length - 1 ஆக இருக்கும்',
      ],
      intermediate: [
        'right = arr.length → off-by-one பிழை',
        'கடைசி valid index: arr.length - 1',
        'loop condition: left < right (அல்லது) left <= right',
        'ஒரு variant தேர்ந்தெடுத்து நிலையாக பயன்படுத்தவும்',
      ],
      advanced: [
        'right = arr.length → index out of bounds (worst case)',
        'half-open interval [left, right) → condition: left < right',
        'closed interval [left, right] → condition: left <= right',
        'variant inconsistency → infinite loop or missed elements',
      ],
    },
    hints: [
      'வரம்பு அமைப்பு loop condition உடன் பொருந்த வேண்டும்',
      'arr[mid] == target கண்டால் mid ஐ மீண்டும் சரிபார்க்க வேண்டாம்',
      'right = n-1 → left <= right; right = n → left < right',
    ],
    steps: [
      'left = 0, right = arr.length - 1 என அமைக்கவும்',
      'while left <= right என்று loop போடவும்',
      'mid = (left + right) // 2 கணக்கிடவும்',
      'arr[mid] == target → return mid',
      'arr[mid] < target → left = mid + 1',
      'arr[mid] > target → right = mid - 1',
    ],
    recommendedProblem: { title: 'முதல் நிகழ்வு கண்டுபிடி', difficulty: 'Medium' },
  },
  // 1 — infinite loop
  {
    mistake: 'left pointer முன்னேறாமல் infinite loop ஆகலாம்',
    explanation: {
      beginner: [
        'left = mid என்பது தவறு',
        'left = mid + 1 என்று வைக்க வேண்டும்',
        'இல்லாவிடில் loop நிற்காது',
      ],
      intermediate: [
        'left = mid → left, right adjacent ஆகும்போது loop நிற்காது',
        'mid எப்போதும் left ஆகவே இருக்கும்',
        'சரி: left = mid + 1 (mid ஐ exclude செய்ய)',
      ],
      advanced: [
        'left = mid → non-termination when right = left + 1',
        'mid = left (floor division) → left never advances',
        'Fix: left = mid + 1 guarantees strict progress',
        'Alternatively use right = mid for upper-bound variant',
      ],
    },
    hints: [
      'arr[mid] < target என தெரிந்தால் mid ஐ கடந்து செல்லவும்',
      'left=[1,2], target=2 → left=mid vs left=mid+1 trace செய்யவும்',
      'left = mid + 1 → ஒவ்வொரு iteration லும் முன்னேற்றம் உறுதி',
    ],
    steps: [
      'arr[mid] < target என்றால் left = mid + 1 வைக்கவும்',
      'arr[mid] > target என்றால் right = mid - 1 வைக்கவும்',
      'இரண்டு pointer களும் நகர்கின்றன என சரிபார்க்கவும்',
    ],
    recommendedProblem: { title: 'சுழற்றப்பட்ட வரிசையில் தேடு', difficulty: 'Hard' },
  },
  // 2 — recursion base case
  {
    mistake: 'மறுசுழற்சியில் base case இல்லை',
    explanation: {
      beginner: [
        'function எப்போது நிற்கும் என தெரியவில்லை',
        'நிறுத்தும் நிலை (base case) தேவை',
        'இல்லாவிடில் stack overflow வரும்',
      ],
      intermediate: [
        'Base case இல்லாமல் → infinite recursion',
        'Stack overflow → memory exhaustion',
        'n == 0 அல்லது n == 1 → directly return செய்யவும்',
      ],
      advanced: [
        'Missing base case → stack overflow O(n) depth',
        'Every recursive call must reduce problem size',
        'Ensure: base_condition → O(1) return, no further calls',
      ],
    },
    hints: [
      'எந்த சிறிய input க்கு function நேரடியாக return செய்யும்?',
      'n <= 0 → return 0 என்று தொடக்கத்தில் சேர்க்கவும்',
      'recursive call க்கு முன் base case check செய்யவும்',
    ],
    steps: [
      'n == 0 அல்லது n == 1 என்று base case எழுதவும்',
      'Base case → நேரடியாக value return செய்யவும்',
      'Recursive case → சிறிய problem க்கு call செய்யவும்',
      'ஒவ்வொரு call லும் problem size குறைகிறதா என பார்க்கவும்',
    ],
    recommendedProblem: { title: 'Fibonacci மனப்பாட மேம்பாடு', difficulty: 'Easy' },
  },
  // 3 — DP table
  {
    mistake: 'DP அட்டவணை சரியாக தொடங்கப்படவில்லை',
    explanation: {
      beginner: [
        'DP table ல் ஆரம்ப மதிப்புகள் தேவை',
        '0 வரிசை மற்றும் 0 நெடுவரிசை முதலில் நிரப்பவும்',
        'இல்லாவிடில் தவறான விடை வரும்',
      ],
      intermediate: [
        'dp[0][j] மற்றும் dp[i][0] → base cases',
        'Empty sub-problem → 0 அல்லது boundary value',
        'Main loop க்கு முன் boundary rows நிரப்பவும்',
      ],
      advanced: [
        'Uninitialized dp table → undefined behavior or wrong answers',
        'dp[0][*] = dp[*][0] = 0 for most string/sequence problems',
        'Transition: dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])',
      ],
    },
    hints: [
      'dp[0][j] மற்றும் dp[i][0] என்ன குறிக்கும் என யோசிக்கவும்',
      '0th row மற்றும் 0th column → empty sub-problem',
      'dp = [[0]*(n+1) for _ in range(m+1)] என initialize செய்யவும்',
    ],
    steps: [
      'dp array ஐ zeros உடன் create செய்யவும்',
      '0th row மற்றும் 0th column base values நிரப்பவும்',
      'i=1 to m, j=1 to n loop போடவும்',
      'ஒவ்வொரு cell க்கும் recurrence relation பயன்படுத்தவும்',
      'dp[m][n] → final answer',
    ],
    recommendedProblem: { title: 'நீண்ட பொது துணை வரிசை', difficulty: 'Hard' },
  },
  // 4 — array out of bounds
  {
    mistake: 'வரிசை index வரம்பை மீறுகிறது',
    explanation: {
      beginner: [
        'i <= arr.length என்பது தவறு',
        'i < arr.length என்று வைக்க வேண்டும்',
        '0 முதல் length-1 வரை மட்டுமே செல்லலாம்',
      ],
      intermediate: [
        'Zero-indexed → valid range: [0, length-1]',
        'i <= length → last iteration: arr[length] → undefined',
        'Loop condition: i < arr.length (strict less than)',
      ],
      advanced: [
        'Off-by-one → accessing arr[n] which is out of bounds',
        'Results in ArrayIndexOutOfBoundsException (Java) or undefined (JS)',
        'Use enhanced for-loop to eliminate index management',
      ],
    },
    hints: [
      'Index 0 முதல் length-1 வரை மட்டுமே valid',
      'for (i = 0; i < arr.length; i++) → strict < பயன்படுத்தவும்',
      'Enhanced for-loop பயன்படுத்தினால் இந்த பிழை வராது',
    ],
    steps: [
      'Loop condition: i < arr.length என மாற்றவும்',
      'கடைசி valid index: arr.length - 1 என நினைவில் வைக்கவும்',
      'Enhanced for-loop பயன்படுத்த பரிசீலிக்கவும்',
    ],
    recommendedProblem: { title: 'அதிகபட்ச துணை வரிசை (Kadane)', difficulty: 'Medium' },
  },
];

// English bullet explanations by level
export const ENGLISH_BULLETS = [
  {
    beginner:     ['Your right boundary is too large — use arr.length - 1', 'Last valid index is always length - 1', 'This causes an off-by-one error'],
    intermediate: ['right = arr.length → off-by-one error', 'Valid indices: 0 to length - 1', 'Loop condition must match boundary choice', 'Pick one variant and stay consistent'],
    advanced:     ['right = arr.length → potential OOB on exhaustion', 'Half-open [left, right) → left < right', 'Closed [left, right] → left <= right', 'Variant mismatch → subtle bugs or infinite loops'],
  },
  {
    beginner:     ['left = mid is wrong — use left = mid + 1', 'Without this fix, the loop never ends', 'Always move past the checked position'],
    intermediate: ['left = mid → infinite loop when right = left + 1', 'mid always equals left (floor division)', 'Fix: left = mid + 1 to skip past mid'],
    advanced:     ['left = mid → non-termination; mid = ⌊(l+r)/2⌋ = l when r=l+1', 'Strict progress required: left = mid + 1', 'Upper-bound variant: right = mid instead'],
  },
  {
    beginner:     ['Your function never stops — it needs a base case', 'A base case is the simplest answer', 'Without it: stack overflow crash'],
    intermediate: ['No base case → infinite recursion → stack overflow', 'Every recursive call must reduce problem size', 'Add: if n <= 0: return 0 before recursive call'],
    advanced:     ['Missing base case → O(∞) call depth, stack overflow', 'Recurrence must have at least one non-recursive branch', 'Ensure well-founded termination (n strictly decreasing)'],
  },
  {
    beginner:     ['DP table needs starting values (base cases)', 'Fill row 0 and column 0 first', 'Wrong start = wrong final answer'],
    intermediate: ['dp[0][j] = dp[i][0] = 0 for most sequence problems', 'These represent empty sub-problem solutions', 'Initialize before filling inner cells'],
    advanced:     ['Uninitialized cells → undefined transition values', 'Boundary: dp[0][*] = dp[*][0] = 0 (empty sequence)', 'Transition: dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])'],
  },
  {
    beginner:     ['Loop goes one step too far — use < not <=', 'Arrays start at 0 and end at length-1', 'Last index is length-1, not length'],
    intermediate: ['i <= arr.length → accesses arr[length] which is undefined', 'Valid index range: [0, length-1]', 'Use i < arr.length (strict less than)'],
    advanced:     ['Off-by-one: arr[n] is out of bounds → exception or undefined', 'Zero-indexed arrays: valid range [0, n-1]', 'Enhanced for-loop eliminates index management entirely'],
  },
];

/** Get the right bullet list for a given analysis index + level + lang */
export function getBullets(analysisIndex, level, lang) {
  const idx = Math.min(analysisIndex, 4);
  if (lang === 'ta') {
    return TAMIL_ANALYSES[idx].explanation[level] || TAMIL_ANALYSES[idx].explanation.beginner;
  }
  return ENGLISH_BULLETS[idx][level] || ENGLISH_BULLETS[idx].beginner;
}

export function getTamilAnalysis(analysisIndex) {
  return TAMIL_ANALYSES[Math.min(analysisIndex, 4)];
}
