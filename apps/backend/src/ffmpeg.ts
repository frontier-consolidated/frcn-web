import ffmpegInstall from "@ffmpeg-installer/ffmpeg";
import ffprobeInstall from "@ffprobe-installer/ffprobe";
import fluentFfmpeg from "fluent-ffmpeg";

fluentFfmpeg.setFfmpegPath(ffmpegInstall.path);
fluentFfmpeg.setFfprobePath(ffprobeInstall.path);

export function ffmpeg(fn: (command: fluentFfmpeg.FfmpegCommand) => fluentFfmpeg.FfmpegCommand) {
	return new Promise<void>((resolve, reject) => {
		const command = fluentFfmpeg({
			niceness: 20
		});
		fn(command);
		// @ts-ignore
		command.on("end", resolve);
		// @ts-ignore
		command.on("error", reject);
	});
}

export function ffprobe(file: string) {
	return new Promise<fluentFfmpeg.FfprobeData>((resolve, reject) => {
		fluentFfmpeg.ffprobe(file, (err, data) => {
			if (err) return reject(err);
			resolve(data);
		});
	});
}
