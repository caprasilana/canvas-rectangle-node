// called when the runtime loads the node on startup
module.exports = function (RED) {

	// called whenever a new instance of the node is created
	// the 'config' argument contains node specific properties set in the editor
	function CanvasRectangleNode(config) {
		RED.nodes.createNode(this, config);

		// set properties
		this.imagePath = config.imagePath;
		this.width = config.width;
		this.height = config.height;
		this.offset_x = config.offset_x;
		this.offset_y = config.offset_y;
		this.title = config.title;

		const node = this
		const lineWidth = 3;
		const font = '30px Impact';
		const { createCanvas, loadImage } = require('canvas');

		// register a listener to the 'input' event
		// which gets called whenever a message arrives at the node
		node.on('input', function (msg, send, done) {

			// For maximum backwards compatibility, check that send exists.
			// If this node is installed in Node-RED 0.x, it will need to
			// fallback to using `node.send`
			send = send || function () { node.send.apply(node, arguments) }

			// Draw cat with lime helmet
			loadImage(node.imagePath).then((image) => {
				
				// get Image dimension
				var width = parseInt(image.width);
				var height = parseInt(image.height);

				// generate canvas and fill with image
				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext('2d');
				ctx.drawImage(image, 0, 0, width, height);
				let color = 'yellow';
				// check if msg.payload is from tensorFlow 
				if (msg.payload && Array.isArray(msg.payload) && msg.payload[0] &&
					msg.payload[0].bbox && Array.isArray(msg.payload[0].bbox) &&
					msg.payload[0].score && msg.payload[0].class) {
					msg.payload.forEach(function (element) {

						// get rounded score
						const score = (Math.round(element.score * 100));
						color = score >= 90 ? 'lightgreen' : (score >= 75 ? 'yellow' : 'red');
						if (element.class) {
							// Write tensorFlow Class + score
							ctx.font = font;
							ctx.rotate(0);
							ctx.fillStyle = color;
							ctx.fillText(element.class + ' ' + score + "%",
								element.bbox[0], element.bbox[1] - lineWidth);
						}
						// Draw Basic Rectangle
						ctx.beginPath();
						ctx.rect(element.bbox[0], element.bbox[1], element.bbox[2], element.bbox[3]);
						ctx.lineWidth = lineWidth;
						ctx.strokeStyle = color;
						ctx.stroke();
					});
				}
				else if (node.width > 0 && node.height > 0) {

					// check if offset is inside image
					if (node.offset_x < width && node.offset_y < height) {

						// calculate if rectangle will be inside image 
						const rectWidth = node.offset_x + node.width > width ? width - node.offset_x : node.width;
						const rectHeight = node.offset_y + node.height > height ? height - node.offset_y : node.height;

						if (node.title) {
							// Write title from node input
							ctx.font = font;
							ctx.rotate(0);
							ctx.fillText(node.title, node.offset_x, node.offset_y - lineWidth);
						}
						// Draw Rectangle from node input
						ctx.beginPath();
						ctx.rect(node.offset_x, node.offset_y, rectWidth, rectHeight);
						ctx.lineWidth = lineWidth;
						ctx.strokeStyle = color;
						ctx.stroke();
					}
				}

				msg.payload = canvas.toDataURL('image/png').split('base64,')[1].toString();
				send(msg);

				if (done) {
					done();
				}

			});
		});

		node.on('close', function () {
		})
	}
	RED.nodes.registerType("canvas-rectangle-node", CanvasRectangleNode);
}