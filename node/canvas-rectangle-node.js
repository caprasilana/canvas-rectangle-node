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

				var width = parseInt(image.width);
				var height = parseInt(image.height);
				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext('2d');
				ctx.drawImage(image, 0, 0, width, height);

				if (node.width > 0 && node.height > 0) {
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