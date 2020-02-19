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
		const { createCanvas, loadImage } = require('canvas');

		// register a listener to the 'input' event
		// which gets called whenever a message arrives at the node
		node.on('input', function (msg) {

			// Draw cat with lime helmet
			loadImage(node.imagePath).then((image) => {

				// get Image dimension
				var width = parseInt(image.width);
				var height = parseInt(image.height);

				// generate canvas and fill with image
				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext('2d');
				ctx.drawImage(image, 0, 0, width, height);

				// check if msg.payload is from tensorFlow
				if (msg.payload && Array.isArray(msg.payload) && msg.payload[0] && Array.isArray(msg.payload[0].bbox)) {
					msg.payload.forEach(function (element) {

						// get rounded score
						const score = (Math.round(element.score * 100));
						const color = score >= 90 ? 'lightgreen' : (score >= 75 ? 'yellow' : 'red');
						if (element.class) {
							// Write tensorFlow Class + score
							ctx.font = '30px Impact';
							ctx.rotate(0);
							ctx.fillStyle = color;
							ctx.fillText(element.class + ' ' + score + "%",
								element.bbox[0], element.bbox[1] - lineWidth);
						}
						// Draw Basic Rectangle
						ctx.beginPath();
						ctx.rect(element.bbox[0], element.bbox[1], element.bbox[2], element.bbox[3]);
						ctx.lineWidth = lineWidth;
						ctx.strokeStyle =color ;
						ctx.stroke();
					});
				}
				else if (node.width > 0 && node.height > 0) {
					if (node.title) {
						// Write "Hello World!"
						ctx.font = '30px Impact';
						ctx.rotate(0);
						ctx.fillText(node.title, node.offset_x, node.offset_y - lineWidth);
					}
					// Draw Basic Rectangle
					ctx.beginPath();
					ctx.rect(node.offset_x, node.offset_y, node.width, node.height);
					ctx.lineWidth = lineWidth;
					ctx.strokeStyle = 'yellow';
					ctx.stroke();
				}

				msg.payload = canvas.toDataURL('image/png').split('base64,')[1].toString();
				node.send(msg);

			});


		});

		node.on('close', function () {
		})
	}
	RED.nodes.registerType("canvas-rectangle-node", CanvasRectangleNode);
}