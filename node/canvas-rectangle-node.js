// called when the runtime loads the node on startup
module.exports = function (RED) {

	// called whenever a new instance of the node is created
	// the 'config' argument contains node specific properties set in the editor
	function CanvasRectangleNode(config) {
		RED.nodes.createNode(this, config);

		// set properties
		this.imagePath = config.imagePath
		const node = this

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

				// Write "Hello World!"
				ctx.font = '30px Impact';
				ctx.rotate(0);
				ctx.fillText('Hello World!', 50, 100);

				// Draw Basic Rectangle
				ctx.beginPath();
				ctx.rect(188, 50, 200, 100);
				//context.fillStyle = 'yellow';
				//context.fill();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'yellow';
				ctx.stroke();


				msg.payload = canvas.toDataURL('image/png', 0.5).split('base64,')[1].toString();
				node.send(msg);

			});


		});

		node.on('close', function () {
		})
	}
	RED.nodes.registerType("canvas-rectangle-node", CanvasRectangleNode);
}