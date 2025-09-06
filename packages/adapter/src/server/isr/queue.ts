/* eslint-disable @typescript-eslint/no-explicit-any */
export type Task = {
	fn: () => Promise<any>;
	fulfil: (value: any) => void;
	reject: (error: Error) => void;
};

export type Queue = ReturnType<typeof queue>;

export function queue(concurrency: number) {
	const tasks: Task[] = [];

	let current = 0;

	let fulfil: (value?: any) => void;
	let reject: (error: Error) => void;

	let closed = false;

	const done = new Promise((f, r) => {
		fulfil = f;
		reject = r;
	});

	done.catch(() => {
		// this is necessary in case a catch handler is never added
		// to the done promise by the user
	});

	function dequeue() {
		if (current < concurrency) {
			const task = tasks.shift();

			if (task) {
				current += 1;
				const promise = Promise.resolve(task.fn());

				promise
					.then(task.fulfil, (err) => {
						task.reject(err);
						reject(err);
					})
					.then(() => {
						current -= 1;
						dequeue();
					});
			} else if (current === 0) {
				closed = true;
				fulfil();
			}
		}
	}

	return {
		/** @param {() => any} fn */
		add: (fn: () => any) => {
			if (closed) throw new Error("Cannot add tasks to a queue that has ended");

			const promise = new Promise((fulfil, reject) => {
				tasks.push({ fn, fulfil, reject });
			});

			dequeue();
			return promise;
		},

		done: () => {
			if (current === 0) {
				closed = true;
				fulfil();
			}

			return done;
		}
	};
}
