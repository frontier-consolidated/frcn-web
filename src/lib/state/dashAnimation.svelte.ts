export function createDashAnimation(dashlength: number) {
	const dashModulo = dashlength * 2;

	let dashoffset = $state(16);
	let animate = $state(true);

	let lastTime: DOMHighResTimeStamp | null = null;
	function render(time: DOMHighResTimeStamp) {
		const deltaMs = lastTime ? time - lastTime : 0;
		lastTime = time;
		const delta = deltaMs / 1000;

		dashoffset -= 25 * delta;
		dashoffset %= dashModulo;

		if (animate) {
			requestAnimationFrame(render);
		}
	}

	return {
		get dashoffset() {
			return dashoffset;
		},
		start() {
			requestAnimationFrame(render);
		},
		stop() {
			animate = false;
		}
	};
}
