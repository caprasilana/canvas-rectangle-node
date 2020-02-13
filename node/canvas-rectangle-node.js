



module.exports = function(RED) {

    function CanvasRectangleNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
const { createCanvas, loadImage } = require('canvas');
        node.on('input', function(msg) {
			
			const canvas = createCanvas(200, 200);
			const ctx = canvas.getContext('2d');

			// Write "Hello Word!"
			ctx.font = '30px Impact';
			ctx.rotate(0);
			ctx.fillText('Hello Word!', 50, 100);

			// Draw Basic Rectangle
			ctx.beginPath();
			ctx.rect(188, 50, 200, 100);
			//context.fillStyle = 'yellow';
			//context.fill();
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'yellow';
			ctx.stroke();

			// Draw cat with lime helmet
			loadImage('/home/pi/.node-red/node_modules/node-red-dashboard/dist/CameraImages/frame.png').then((image) => {
				ctx.drawImage(image, 50, 0, 70, 70);
				msg.payload =  canvas.toDataURL();
				
			});
		
            node.send(msg);
        });
    }
    RED.nodes.registerType("canvas-rectangle-node",CanvasRectangleNode);
}