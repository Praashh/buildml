export function TerminalPreview() {
	return (
		<div className="overflow-hidden rounded-[4px] bg-[var(--term-bg)] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
			{/* Header bar */}
			<div className="flex items-center gap-[7px] border-[var(--term-border)] border-b bg-[#0A0908] px-4 py-3">
				<div className="h-[10px] w-[10px] rounded-full bg-[#FF5F56]" />
				<div className="h-[10px] w-[10px] rounded-full bg-[#FFBD2E]" />
				<div className="h-[10px] w-[10px] rounded-full bg-[#27C93F]" />
				<div className="ml-auto text-[#3A3830] text-[10px] tracking-[0.06em]">
					attention.py — challenge #4
				</div>
			</div>

			{/* Code body */}
			<div className="px-5 pt-5 pb-6">
				{[
					{
						n: 1,
						code: (
							<>
								<span className="text-[var(--term-keyword)]">import</span> numpy{" "}
								<span className="text-[var(--term-keyword)]">as</span> np
							</>
						),
					},
					{ n: 2, code: null },
					{
						n: 3,
						code: (
							<>
								<span className="text-[var(--term-keyword)]">def</span>{" "}
								<span className="text-[var(--term-function)]">attention</span>
								(Q, K, V):
							</>
						),
					},
					{
						n: 4,
						code: (
							<>
								&nbsp;&nbsp;
								<span className="text-[var(--term-comment)] italic">
									# scaled dot-product attention
								</span>
							</>
						),
					},
					{
						n: 5,
						code: (
							<>
								&nbsp;&nbsp;d_k{" "}
								<span className="text-[var(--term-operator)]">=</span> Q.shape[
								<span className="text-[var(--term-number)]">-1</span>]
							</>
						),
					},
					{
						n: 6,
						code: (
							<>
								&nbsp;&nbsp;scores{" "}
								<span className="text-[var(--term-operator)]">=</span> Q{" "}
								<span className="text-[var(--term-operator)]">@</span> K.T{" "}
								<span className="text-[var(--term-operator)]">/</span>{" "}
								np.sqrt(d_k)
							</>
						),
					},
					{
						n: 7,
						code: (
							<>
								&nbsp;&nbsp;w{" "}
								<span className="text-[var(--term-operator)]">=</span>{" "}
								<span className="text-[var(--term-function)]">softmax</span>
								(scores, axis
								<span className="text-[var(--term-operator)]">=-1</span>)
							</>
						),
					},
					{
						n: 8,
						code: (
							<>
								&nbsp;&nbsp;
								<span className="text-[var(--term-keyword)]">return</span> w{" "}
								<span className="text-[var(--term-operator)]">@</span> V
							</>
						),
					},
					{ n: 9, code: null },
					{
						n: 10,
						code: (
							<>
								<span className="text-[var(--term-keyword)]">def</span>{" "}
								<span className="text-[var(--term-function)]">softmax</span>(x,
								axis<span className="text-[var(--term-operator)]">=-1</span>):
							</>
						),
					},
					{
						n: 11,
						code: (
							<>
								&nbsp;&nbsp;e{" "}
								<span className="text-[var(--term-operator)]">=</span> np.
								<span className="text-[var(--term-function)]">exp</span>(x{" "}
								<span className="text-[var(--term-operator)]">-</span> x.
								<span className="text-[var(--term-function)]">max</span>(axis,
								keepdims
								<span className="text-[var(--term-operator)]">=True</span>))
							</>
						),
					},
					{
						n: 12,
						code: (
							<>
								&nbsp;&nbsp;
								<span className="text-[var(--term-keyword)]">return</span> e{" "}
								<span className="text-[var(--term-operator)]">/</span> e.
								<span className="text-[var(--term-function)]">sum</span>(axis,
								keepdims
								<span className="text-[var(--term-operator)]">=True</span>){" "}
								<span className="inline-block h-[13px] w-[7px] animate-cursor-blink bg-primary align-middle" />
							</>
						),
					},
				].map((line) => (
					<div
						className="flex gap-[14px] text-[var(--term-fg)] text-xs leading-[1.95]"
						key={line.n}
					>
						<span className="min-w-[18px] select-none text-right text-[11px] text-[var(--term-line)]">
							{line.n}
						</span>
						<span>{line.code ?? "\u00A0"}</span>
					</div>
				))}
			</div>
		</div>
	);
}
