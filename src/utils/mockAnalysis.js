export const STARTER_CODE = {
  python: `def binary_search(arr, target):
    left, right = 0, len(arr)   # Bug: should be len(arr) - 1

    while left < right:          # Bug: should be left <= right
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid           # Bug: should be mid + 1
        else:
            right = mid

    return -1

# Test
arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))
`,
  java: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length; // Bug: should be arr.length - 1

        while (left < right) {            // Bug: should be left <= right
            int mid = (left + right) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target)
                left = mid;               // Bug: should be mid + 1
            else
                right = mid;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(search(arr, 7));
    }
}
`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size(); // Bug: should be arr.size() - 1

    while (left < right) {            // Bug: should be left <= right
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target)
            left = mid;               // Bug: should be mid + 1
        else
            right = mid;
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
    cout << binarySearch(arr, 7) << endl;
    return 0;
}
`,
};

// Each entry now carries an analysisIndex for Tamil lookup
const ANALYSES = [
  {
    analysisIndex: 0,
    mistake: 'Incorrect binary search boundary initialization',
    concept: 'binary_search',
    confidence: 0.88,
    explanation: 'Your right boundary is set to arr.length instead of arr.length - 1. This causes an off-by-one error and may access an out-of-bounds index when the search space is exhausted.',
    explanationBullets: [
      'right = arr.length → off-by-one error',
      'Last valid index is arr.length - 1',
      'Loop condition must match your boundary choice',
      'Pick one variant and be consistent throughout',
    ],
    hints: [
      'Binary search has multiple valid variants — ensure your boundary initialization is consistent with your loop condition.',
      'Check what happens when arr[mid] equals the target. Does your update avoid revisiting the same midpoint?',
      "If right = len(arr), your loop condition should be left < right; if right = len(arr)-1, use left <= right.",
    ],
    steps: [
      'Set left = 0, right = arr.length - 1',
      'Loop while left <= right',
      'Compute mid = (left + right) // 2',
      'If arr[mid] == target → return mid',
      'If arr[mid] < target → left = mid + 1',
      'If arr[mid] > target → right = mid - 1',
    ],
    recommendedProblem: { title: 'Find First Occurrence', difficulty: 'Medium' },
  },
  {
    analysisIndex: 1,
    mistake: 'Infinite loop risk — left pointer does not advance',
    concept: 'binary_search',
    confidence: 0.82,
    explanation: "Setting left = mid instead of left = mid + 1 can cause an infinite loop when left and right are adjacent. The midpoint always equals left and the search never converges.",
    explanationBullets: [
      'left = mid → infinite loop when right = left + 1',
      'mid always equals left (floor division)',
      'Fix: left = mid + 1 to skip past the checked position',
      'Every iteration must make strict progress',
    ],
    hints: [
      "After confirming arr[mid] < target, you've already eliminated mid — so left should skip past it.",
      'Try tracing arr = [1, 2], target = 2 manually using left = mid vs left = mid + 1.',
      'The fix is one character: left = mid + 1 guarantees forward progress every iteration.',
    ],
    steps: [
      'When arr[mid] < target, set left = mid + 1',
      'When arr[mid] > target, set right = mid - 1',
      'Verify both pointers always move each iteration',
    ],
    recommendedProblem: { title: 'Search in Rotated Array', difficulty: 'Hard' },
  },
  {
    analysisIndex: 2,
    mistake: 'Recursion missing base case',
    concept: 'recursion',
    confidence: 0.79,
    explanation: 'Your recursive function has no base case that terminates recursion. Every call will spawn another indefinitely, resulting in a stack overflow for any non-trivial input.',
    explanationBullets: [
      'No base case → infinite recursion',
      'Stack overflow will crash the program',
      'Every recursive function needs a stopping condition',
      'Add: if n <= 0: return 0 before the recursive call',
    ],
    hints: [
      'Every recursive function needs at least one base case that returns without a recursive call.',
      'Ask yourself: what is the smallest input this function could receive, and what should it return?',
      'Add a guard at the top — e.g. if n <= 0: return 0 — before the recursive step.',
    ],
    steps: [
      'Identify the simplest input (e.g. n == 0 or n == 1)',
      'Write the base case: if n == 0: return 0',
      'Write the recursive case using a smaller sub-problem',
      'Verify problem size strictly decreases each call',
    ],
    recommendedProblem: { title: 'Fibonacci with Memoization', difficulty: 'Easy' },
  },
  {
    analysisIndex: 3,
    mistake: 'DP table not properly initialized',
    concept: 'dp',
    confidence: 0.75,
    explanation: 'Your DP table is missing proper base case initialization. The 0th row and 0th column represent empty sub-problems and must be seeded before the fill loop runs.',
    explanationBullets: [
      'DP table base cases are missing',
      '0th row and 0th column must be initialized first',
      'These represent the "empty sub-problem" answers',
      'Initialize with zeros before running the main loop',
    ],
    hints: [
      'DP tables require base cases just like recursion — typically the 0th row and 0th column.',
      'Ask: what does dp[0][j] and dp[i][0] mean in the context of your problem?',
      'Initialize with dp = [[0]*(n+1) for _ in range(m+1)] and fill boundary rows before the main loop.',
    ],
    steps: [
      'Create dp = [[0]*(n+1) for _ in range(m+1)]',
      'Fill dp[0][j] = 0 for all j (empty first string)',
      'Fill dp[i][0] = 0 for all i (empty second string)',
      'Loop i from 1 to m, j from 1 to n',
      'Apply recurrence relation to fill each cell',
      'Return dp[m][n] as the final answer',
    ],
    recommendedProblem: { title: 'Longest Common Subsequence', difficulty: 'Hard' },
  },
  {
    analysisIndex: 4,
    mistake: 'Array traversal going out of bounds',
    concept: 'arrays',
    confidence: 0.84,
    explanation: 'Your loop iterates to i <= arr.length instead of i < arr.length. Arrays are zero-indexed, so the last valid index is length - 1.',
    explanationBullets: [
      'Loop condition i <= arr.length is wrong',
      'Arrays are zero-indexed: valid range is [0, length-1]',
      'arr[length] does not exist → crash or undefined',
      'Fix: use i < arr.length (strict less than)',
    ],
    hints: [
      "In zero-indexed languages (Java, Python, C++), valid indices run from 0 to length - 1.",
      'Check every loop boundary: for (int i = 0; i < arr.length; i++) — not i <= arr.length.',
      'Use enhanced for-loops or built-in iterators to eliminate off-by-one errors entirely.',
    ],
    steps: [
      'Change loop condition to i < arr.length',
      'Remember: last valid index is arr.length - 1',
      'Consider using an enhanced for-loop to avoid index issues',
    ],
    recommendedProblem: { title: 'Maximum Subarray (Kadane)', difficulty: 'Medium' },
  },
];

export async function analyzeCode(code) {
  await new Promise(r => setTimeout(r, 1800));
  return { ...ANALYSES[Math.floor(Math.random() * ANALYSES.length)] };
}
