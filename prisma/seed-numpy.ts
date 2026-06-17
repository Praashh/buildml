// Problem Set: NumPy Fundamentals
// Distribution: 3 Easy, 3 Medium, 3 Hard (Total 9 problems)

import { prisma } from "~/db";

async function main() {
	const numpyProblemSet = await prisma.problemSet.upsert({
		where: { slug: "numpy-fundamentals" },
		update: {
			title: "NumPy Fundamentals",
			description:
				"Essential exercises to master NumPy for data science and machine learning. Covers array manipulation, broadcasting, and vectorization.",
		},
		create: {
			title: "NumPy Fundamentals",
			slug: "numpy-fundamentals",
			description:
				"Essential exercises to master NumPy for data science and machine learning. Covers array manipulation, broadcasting, and vectorization.",
		},
	});

	console.log(`Created problem set: ${numpyProblemSet.title}`);

	const problems = [
		// === EASY PROBLEMS ===
		{
			title: "Create and Reshape",
			slug: "numpy-create-reshape",
			difficulty: "Easy",
			order: 1,
			problemSetId: numpyProblemSet.id,
			description: `
Create a 1D NumPy array of integers ranging from 0 to $N-1$ (inclusive), and then reshape it into a 2D array with the specified number of \`rows\` and \`cols\`.

### Function Signature
\`\`\`python
def create_and_reshape(N, rows, cols):
    """
    N: int - number of elements (0 to N-1)
    rows: int - number of rows in output
    cols: int - number of columns in output
    returns: np.ndarray of shape (rows, cols) containing 0..N-1
    """
\`\`\`
`,
			templateCode: `import numpy as np

def create_and_reshape(N, rows, cols):
    """
    N: int - number of elements (0 to N-1)
    rows: int - number of rows in output
    cols: int - number of columns in output
    returns: np.ndarray of shape (rows, cols) containing 0..N-1
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import create_and_reshape

def test():
    # Test 1: Basic case
    N, rows, cols = 10, 2, 5
    res = create_and_reshape(N, rows, cols)
    assert isinstance(res, np.ndarray), "Result must be a numpy array"
    assert res.shape == (rows, cols), f"Expected shape {(rows, cols)}, got {res.shape}"
    assert np.array_equal(res.flatten(), np.arange(N)), "Values must be 0..N-1"

    # Test 2: Another dimension
    N, rows, cols = 12, 4, 3
    res = create_and_reshape(N, rows, cols)
    assert res.shape == (rows, cols), f"Expected shape {(rows, cols)}, got {res.shape}"
    assert res[0, 0] == 0, "First element should be 0"
    assert res[-1, -1] == N-1, f"Last element should be {N-1}"

    # Test 3: Large array
    N, rows, cols = 100, 10, 10
    res = create_and_reshape(N, rows, cols)
    assert res.size == N, "Incorrect size"
    
    # Test 4: Check dtype implies integer
    assert np.issubdtype(res.dtype, np.integer), "Array should contain integers"

    # Test 5: Check single row
    N, rows, cols = 5, 1, 5
    res = create_and_reshape(N, rows, cols)
    assert res.shape == (1, 5)

    # Test 6: Check single column
    N, rows, cols = 5, 5, 1
    res = create_and_reshape(N, rows, cols)
    assert res.shape == (5, 1)
    
    # Test 7: Value correctness check
    assert res[2, 0] == 2
    
    # Test 8: Correct Range
    assert res.min() == 0
    assert res.max() == 4
    
    # Test 9: Connectivity (reshape correctness)
    flat = res.flatten()
    assert flat[1] == 1

    # Test 10: Row-major order check (C-style)
    res_2x5 = create_and_reshape(10, 2, 5)
    assert res_2x5[0, 4] == 4
    assert res_2x5[1, 0] == 5

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Replace Odd Numbers",
			slug: "numpy-replace-odd",
			difficulty: "Easy",
			order: 2,
			problemSetId: numpyProblemSet.id,
			description: `
Given a 1D array of integers, replace all odd numbers with -1 without changing the original array (return a new array).

### Function Signature
\`\`\`python
def replace_odd(arr):
    """
    arr: np.ndarray (1D)
    returns: np.ndarray with odd numbers replaced by -1
    """
\`\`\`
`,
			templateCode: `import numpy as np

def replace_odd(arr):
    """
    arr: np.ndarray (1D)
    returns: np.ndarray with odd numbers replaced by -1
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import replace_odd

def test():
    # Test 1: Basic mixed array
    arr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    res = replace_odd(arr)
    expected = np.array([0, -1, 2, -1, 4, -1, 6, -1, 8, -1])
    assert np.array_equal(res, expected), f"Expected {expected}, got {res}"

    # Test 2: All even
    arr = np.array([2, 4, 6])
    res = replace_odd(arr)
    assert np.array_equal(res, arr), "All even array should be unchanged"

    # Test 3: All odd
    arr = np.array([1, 3, 5])
    res = replace_odd(arr)
    assert np.all(res == -1), "All odd numbers should be -1"

    # Test 4: Empty array
    arr = np.array([])
    res = replace_odd(arr)
    assert res.size == 0, "Empty array should return empty"

    # Test 5: Negative numbers
    arr = np.array([-2, -3, -4])
    res = replace_odd(arr)
    assert res[0] == -2
    assert res[1] == -1
    assert res[2] == -4
    
    # Test 6: Original array unmodified (immutability check)
    arr_orig = np.array([1, 2, 3])
    original_copy = arr_orig.copy()
    _ = replace_odd(arr_orig)
    assert np.array_equal(arr_orig, original_copy), "Original array was modified - must return new array"
    
    # Test 7: Large array
    arr = np.arange(100)
    res = replace_odd(arr)
    assert np.sum(res == -1) == 50
    
    # Test 8: Check dtype preservation (integers)
    assert np.issubdtype(res.dtype, np.integer)

    # Test 9: Zero check (even)
    arr = np.array([0])
    res = replace_odd(arr)
    assert res[0] == 0

    # Test 10: Single odd
    arr = np.array([7])
    res = replace_odd(arr)
    assert res[0] == -1

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Reverse Array",
			slug: "numpy-reverse-array",
			difficulty: "Easy",
			order: 3,
			problemSetId: numpyProblemSet.id,
			description: `
Reverse a 1D NumPy array.

### Function Signature
\`\`\`python
def reverse_array(arr):
    """
    arr: np.ndarray (1D)
    returns: np.ndarray (reversed)
    """
\`\`\`
`,
			templateCode: `import numpy as np

def reverse_array(arr):
    """
    arr: np.ndarray (1D)
    returns: np.ndarray (reversed)
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import reverse_array

def test():
    # Test 1: Simple range
    arr = np.arange(10)
    res = reverse_array(arr)
    assert np.array_equal(res, np.arange(9, -1, -1)), "Array not reversed correctly"

    # Test 2: Random values
    arr = np.array([1, 5, 2, 8])
    res = reverse_array(arr)
    assert np.array_equal(res, [8, 2, 5, 1])

    # Test 3: Length 1
    arr = np.array([42])
    res = reverse_array(arr)
    assert np.array_equal(res, [42])

    # Test 4: Empty array
    arr = np.array([])
    res = reverse_array(arr)
    assert res.size == 0

    # Test 5: Even number of elements
    arr = np.array([1, 2, 3, 4])
    res = reverse_array(arr)
    assert np.array_equal(res, [4, 3, 2, 1])
    
    # Test 6: Check dtype matches input
    arr = np.array([1.5, 2.5, 3.5])
    res = reverse_array(arr)
    assert res.dtype == arr.dtype

    # Test 7: Floats verification
    assert res[0] == 3.5
    assert res[2] == 1.5

    # Test 8: Negative numbers
    arr = np.array([-1, -2, -3])
    res = reverse_array(arr)
    assert np.array_equal(res, [-3, -2, -1])

    # Test 9: Symmetry consistency (palindrome)
    arr = np.array([1, 2, 1])
    res = reverse_array(arr)
    assert np.array_equal(res, arr)

    # Test 10: Large array
    arr = np.arange(1000)
    res = reverse_array(arr)
    assert res[0] == 999
    assert res[-1] == 0

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},

		// === MEDIUM PROBLEMS ===
		{
			title: "Matrix Normalization",
			slug: "numpy-matrix-normalization",
			difficulty: "Medium",
			order: 4,
			problemSetId: numpyProblemSet.id,
			description: `
Normalize a 2D matrix. Normalization involves subtracting the mean and dividing by the standard deviation (Z-score normalization).

$$X_{norm} = \\\\frac{X - \\\\mu}{\\\\sigma}$$

Note: If standard deviation is 0 (constant matrix), return an array of zeros.

### Function Signature
\`\`\`python
def normalize(matrix):
    """
    matrix: np.ndarray (2D)
    returns: np.ndarray (normalized)
    """
\`\`\`
`,
			templateCode: `import numpy as np

def normalize(matrix):
    """
    matrix: np.ndarray (2D)
    returns: np.ndarray (normalized)
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import normalize

def test():
    # Test 1: Basic random matrix
    np.random.seed(42)
    mat = np.random.rand(5, 5)
    res = normalize(mat)
    
    # Check mean ~ 0
    assert np.isclose(np.mean(res), 0), f"Mean should be 0, got {np.mean(res)}"
    
    # Check std ~ 1 (population or sample std should be close to 1)
    assert np.isclose(np.std(res, ddof=0), 1), f"Std should be 1, got {np.std(res)}"

    # Test 2: Simple values
    mat = np.array([[1, 2], [3, 4]])
    res = normalize(mat)
    assert np.isclose(np.mean(res), 0)
    assert np.isclose(np.std(res, ddof=0), 1)

    # Test 3: Shape check
    assert res.shape == (2, 2)

    # Test 4: Constant matrix (Std = 0 handling)
    mat = np.array([[5, 5], [5, 5]])
    res = normalize(mat)
    assert np.allclose(res, 0), "Constant matrix should return zeros when std=0"
    
    # Test 5: Negative values
    mat = np.array([[-1, -2], [-3, -4]])
    res = normalize(mat)
    assert np.isclose(np.mean(res), 0)

    # Test 6: 1xN Matrix
    mat = np.array([[1, 2, 3, 4, 5]])
    res = normalize(mat)
    assert np.isclose(np.std(res, ddof=0), 1)

    # Test 7: Large values (scaling check)
    mat = np.array([[100, 200], [300, 400]])
    res = normalize(mat)
    # Normalized values should be same as [1,2,3,4] normalized
    ref = normalize(np.array([[1, 2], [3, 4]]))
    assert np.allclose(res, ref)

    # Test 8: Check Dtype is float
    assert np.issubdtype(res.dtype, np.floating)

    # Test 9: Larger Matrix statistical properties
    mat = np.random.rand(100, 100)
    res = normalize(mat)
    assert np.abs(np.mean(res)) < 1e-6
    assert np.abs(np.std(res, ddof=0) - 1) < 1e-6

    # Test 10: Single row high variance
    mat = np.array([[1, 100]])
    res = normalize(mat)
    assert res.shape == (1, 2)
    assert np.isclose(res[0, 0], -1/np.sqrt(2))  # -0.707...
    assert np.isclose(res[0, 1], 1/np.sqrt(2))   # 0.707...
    
    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Common Elements",
			slug: "numpy-common-elements",
			difficulty: "Medium",
			order: 5,
			problemSetId: numpyProblemSet.id,
			description: `
Get the common items between two arrays. Return the **unique** common elements as a sorted 1D array.

### Function Signature
\`\`\`python
def common_elements(a, b):
    """
    a: np.ndarray
    b: np.ndarray
    returns: np.ndarray (sorted unique common elements)
    """
\`\`\`
`,
			templateCode: `import numpy as np

def common_elements(a, b):
    """
    a: np.ndarray
    b: np.ndarray
    returns: np.ndarray (sorted unique common elements)
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import common_elements

def test():
    # Test 1: Basic overlap
    a = np.array([0, 10, 20, 40, 60])
    b = np.array([10, 30, 40])
    res = common_elements(a, b)
    expected = np.array([10, 40])
    assert np.array_equal(res, expected), f"Expected {expected}, got {res}"

    # Test 2: No overlap
    a = np.array([1, 2, 3])
    b = np.array([4, 5, 6])
    res = common_elements(a, b)
    assert res.size == 0, "Should be empty"

    # Test 3: Duplicates in input (should return unique)
    a = np.array([1, 1, 2, 3])
    b = np.array([1, 1, 4])
    res = common_elements(a, b)
    assert np.array_equal(res, np.array([1])), f"Expected [1], got {res}"

    # Test 4: Unsorted inputs
    a = np.array([3, 1, 2])
    b = np.array([2, 4, 3])
    res = common_elements(a, b)
    assert np.array_equal(res, np.array([2, 3])), "Result should be sorted"

    # Test 5: Empty input
    a = np.array([])
    b = np.array([1, 2])
    res = common_elements(a, b)
    assert res.size == 0

    # Test 6: One element overlap
    a = np.array([5])
    b = np.array([1, 5, 9])
    res = common_elements(a, b)
    assert np.array_equal(res, [5])

    # Test 7: Identical arrays
    a = np.array([1, 2, 3])
    b = np.array([1, 2, 3])
    res = common_elements(a, b)
    assert np.array_equal(res, [1, 2, 3])

    # Test 8: Negative numbers
    a = np.array([-1, 0, 1])
    b = np.array([-1, 2, 3])
    res = common_elements(a, b)
    assert np.array_equal(res, [-1])

    # Test 9: Floats
    a = np.array([1.5, 2.5])
    b = np.array([1.5, 3.5])
    res = common_elements(a, b)
    assert np.isclose(res[0], 1.5)

    # Test 10: Check return type
    assert isinstance(res, np.ndarray)

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Closest Value",
			slug: "numpy-closest-value",
			difficulty: "Medium",
			order: 6,
			problemSetId: numpyProblemSet.id,
			description: `
Find the value in a 1D NumPy array \`arr\` that is closest to a given scalar \`v\`. If two values are equidistant, return the first one encountered.

### Function Signature
\`\`\`python
def find_closest(arr, v):
    """
    arr: np.ndarray (1D)
    v: float/int
    returns: element from arr closest to v
    """
\`\`\`
`,
			templateCode: `import numpy as np

def find_closest(arr, v):
    """
    arr: np.ndarray (1D)
    v: float/int
    returns: element from arr closest to v
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import find_closest

def test():
    # Test 1: Basic case
    arr = np.array([1, 2, 3, 4, 5])
    v = 3.6
    res = find_closest(arr, v)
    assert res == 4, f"Expected 4, got {res}"

    # Test 2: Exact match
    arr = np.array([10, 20, 30])
    v = 20
    res = find_closest(arr, v)
    assert res == 20

    # Test 3: Negative numbers
    arr = np.array([-10, -5, 0, 5])
    v = -8
    res = find_closest(arr, v)
    assert res == -10, f"Expected -10, got {res} (dist 2 vs 3)"

    # Test 4: Equidistant (returns first one - index 0)
    arr = np.array([1, 3])
    v = 2
    res = find_closest(arr, v)
    assert res == 1, "Should return first occurrence when equidistant"

    # Test 5: Unsorted array
    arr = np.array([5, 1, 10, 3])
    v = 3.1
    res = find_closest(arr, v)
    assert res == 3

    # Test 6: Single element
    arr = np.array([42])
    v = 100
    res = find_closest(arr, v)
    assert res == 42

    # Test 7: Large array
    arr = np.linspace(0, 10, 100)
    v = 5.01
    res = find_closest(arr, v)
    assert abs(res - 5.0) < 0.2

    # Test 8: Large value v (target outside range)
    arr = np.array([1, 2, 3])
    v = 1000
    res = find_closest(arr, v)
    assert res == 3

    # Test 9: Return type matches array dtype
    arr = np.array([1, 2, 3], dtype=np.int64)
    res = find_closest(arr, 3.6)
    assert res == 4
    assert isinstance(res, np.integer), "Return type should match array element type"

    # Test 10: Float array with float target
    arr = np.array([1.1, 1.2, 1.3])
    v = 1.14
    res = find_closest(arr, v)
    assert np.isclose(res, 1.1)

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},

		// === HARD PROBLEMS ===
		{
			title: "One-Hot Encoding",
			slug: "numpy-one-hot",
			difficulty: "Hard",
			order: 7,
			problemSetId: numpyProblemSet.id,
			description: `
Convert a 1D array of integer labels to a one-hot encoded 2D matrix.
The input array \`labels\` contains integers from \`0\` to \`num_classes - 1\`.
The output should be a matrix of shape \`(len(labels), num_classes)\` with float dtype.

### Function Signature
\`\`\`python
def one_hot(labels, num_classes):
    """
    labels: np.ndarray (1D) of integers
    num_classes: int
    returns: np.ndarray (2D) one-hot encoded, dtype=float
    """
\`\`\`
`,
			templateCode: `import numpy as np

def one_hot(labels, num_classes):
    """
    labels: np.ndarray (1D) of integers
    num_classes: int
    returns: np.ndarray (2D) one-hot encoded
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import one_hot

def test():
    # Test 1: Basic case
    labels = np.array([1, 0, 3])
    num_classes = 4
    res = one_hot(labels, num_classes)
    expected = np.array([
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1]
    ])
    assert np.array_equal(res, expected), "Incorrect one-hot encoding"

    # Test 2: Shape check
    assert res.shape == (3, 4)

    # Test 3: All same label
    labels = np.array([0, 0])
    num_classes = 2
    res = one_hot(labels, num_classes)
    assert np.array_equal(res, [[1, 0], [1, 0]])

    # Test 4: Single class
    labels = np.array([0, 0, 0])
    num_classes = 1
    res = one_hot(labels, num_classes)
    assert res.shape == (3, 1)
    assert np.all(res == 1)

    # Test 5: Empty labels
    labels = np.array([])
    num_classes = 3
    res = one_hot(labels, num_classes)
    assert res.shape == (0, 3)

    # Test 6: Check dtype is float
    assert np.issubdtype(res.dtype, np.floating), "One-hot should be float type"

    # Test 7: Label = num_classes - 1 (boundary)
    labels = np.array([2])
    num_classes = 3
    res = one_hot(labels, num_classes)
    assert res[0, 2] == 1.0

    # Test 8: Multiple identical labels
    labels = np.array([1, 1, 1])
    num_classes = 3
    res = one_hot(labels, num_classes)
    assert np.all(res[:, 1] == 1)

    # Test 9: Large num_classes
    labels = np.array([0, 99])
    num_classes = 100
    res = one_hot(labels, num_classes)
    assert res.shape == (2, 100)
    assert res[1, 99] == 1

    # Test 10: Sum of rows should be 1
    labels = np.random.randint(0, 5, 20)
    res = one_hot(labels, 5)
    assert np.allclose(np.sum(res, axis=1), 1), "Each row must sum to 1"

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Moving Average",
			slug: "numpy-moving-average",
			difficulty: "Hard",
			order: 8,
			problemSetId: numpyProblemSet.id,
			description: `
Compute the moving average of a 1D array using a window size \`n\` (vectorized, no loops).
The output array should have size \`len(arr) - n + 1\`.

### Function Signature
\`\`\`python
def moving_average(arr, n):
    """
    arr: np.ndarray (1D)
    n: int (window size)
    returns: np.ndarray (moving averages)
    """
\`\`\`
`,
			templateCode: `import numpy as np

def moving_average(arr, n):
    """
    arr: np.ndarray (1D)
    n: int (window size)
    returns: np.ndarray (moving averages)
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import moving_average

def test():
    # Test 1: Basic case
    arr = np.array([1, 2, 3, 4, 5])
    n = 3
    res = moving_average(arr, n)
    expected = np.array([2.0, 3.0, 4.0])
    assert np.allclose(res, expected), f"Expected {expected}, got {res}"

    # Test 2: n = 1 (should remain same)
    arr = np.array([10, 20, 30])
    res = moving_average(arr, 1)
    assert np.allclose(res, arr)

    # Test 3: n = len(arr) (single average)
    arr = np.array([1, 2, 3])
    res = moving_average(arr, 3)
    assert len(res) == 1
    assert res[0] == 2.0

    # Test 4: Constant array
    arr = np.ones(10) * 5
    res = moving_average(arr, 3)
    assert np.allclose(res, 5)

    # Test 5: Check output shape formula
    arr = np.arange(10)
    n = 4
    res = moving_average(arr, n)
    assert len(res) == 10 - 4 + 1

    # Test 6: Increasing values
    arr = np.array([0, 1, 2, 3, 4])
    n = 2
    res = moving_average(arr, n)
    assert np.allclose(res, np.array([0.5, 1.5, 2.5, 3.5]))

    # Test 7: n equals array length (edge case)
    arr = np.array([10, 20, 30, 40])
    n = 4
    res = moving_average(arr, n)
    assert len(res) == 1
    assert res[0] == 25.0
    
    # Test 8: Floating point precision
    arr = np.array([1.5, 2.5, 3.5])
    res = moving_average(arr, 2)
    assert np.allclose(res, [2.0, 3.0])

    # Test 9: Random array logic verification
    np.random.seed(123)
    arr = np.random.rand(100)
    res = moving_average(arr, 10)
    # Manual check for first element
    assert np.isclose(res[0], np.mean(arr[:10]))
    # Check last element
    assert np.isclose(res[-1], np.mean(arr[-10:]))

    # Test 10: Check type is float
    arr = np.array([1, 2, 3, 4, 5])
    res = moving_average(arr, 2)
    assert np.issubdtype(res.dtype, np.floating)

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Find Local Maxima",
			slug: "numpy-local-maxima",
			difficulty: "Hard",
			order: 9,
			problemSetId: numpyProblemSet.id,
			description: `
Find all the local maxima in a 1D array. A local maximum is defined as a value that is strictly greater than its neighbors.
- For first element: compare only with second element
- For last element: compare only with second-to-last element
- Single element arrays are considered to have one local maximum

Return the **indices** of local maxima as a 1D array.

### Function Signature
\`\`\`python
def find_local_maxima(arr):
    """
    arr: np.ndarray (1D)
    returns: np.ndarray (indices of local maxima)
    """
\`\`\`
`,
			templateCode: `import numpy as np

def find_local_maxima(arr):
    """
    arr: np.ndarray (1D)
    returns: np.ndarray (indices of local maxima)
    """
    # Your code here
    pass
`,
			testCode: `
import numpy as np
from solution import find_local_maxima

def test():
    # Test 1: Basic middle peak
    arr = np.array([1, 3, 2])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [1]), f"Expected [1], got {res}"

    # Test 2: Two peaks
    arr = np.array([1, 5, 1, 4, 1])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [1, 3])

    # Test 3: Boundary peaks (both ends)
    arr = np.array([5, 1, 5])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [0, 2]), f"Boundary peaks incorrect: {res}"

    # Test 4: Constant array (no strict greater)
    arr = np.array([1, 1, 1])
    res = find_local_maxima(arr)
    assert len(res) == 0, "Constant array should have no local maxima"

    # Test 5: Strictly increasing (last is peak)
    arr = np.array([1, 2, 3])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [2])

    # Test 6: Strictly decreasing (first is peak)
    arr = np.array([3, 2, 1])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [0])

    # Test 7: Empty array
    arr = np.array([])
    res = find_local_maxima(arr)
    assert len(res) == 0

    # Test 8: Single element (treated as peak)
    arr = np.array([10])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [0]), f"Single element should be peak, got {res}"

    # Test 9: Plateau not a peak (strictly greater check)
    arr = np.array([1, 2, 2, 1])
    res = find_local_maxima(arr)
    assert len(res) == 0, "Plateau should not count as local maxima"

    # Test 10: Complex pattern
    arr = np.array([1, 2, 1, 2, 1])
    res = find_local_maxima(arr)
    assert np.array_equal(res, [1, 3]), f"Complex pattern failed: {res}"
    
    # Test 10: Larger random check
    np.random.seed(42)
    arr = np.array([3, 1, 4, 1, 5, 9, 2, 6])
    res = find_local_maxima(arr)
    # Peaks at: 2 (val 4), 5 (val 9), 7 (val 6 - check: 9 > 6? No, 9 is before 6. 6>2 yes. Last element check: 6>2 yes, so 7 is peak)
    # Wait: arr[5]=9, arr[6]=2, arr[7]=6. 9>2 yes (peak), 6>2 yes (peak, last elem)
    # arr[2]=4, arr[1]=1, arr[3]=1. 4 is peak.
    assert 2 in res and 5 in res and 7 in res

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
	];

	for (const problem of problems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: problem,
			create: problem,
		});
	}

	console.log(
		`Seeded ${problems.length} NumPy problems (3 Easy, 3 Medium, 3 Hard)`,
	);
	console.log("Seed successful");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
