#!/usr/bin/env python3

import os
#import signal
from flask import Flask, request, send_from_directory, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__,  static_folder='static')
CORS(app)

#def sigint_handler(signum, frame):
#    exit()

#signal.signal(signal.SIGINT, sigint_handler)

# serve the p5.js app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists('www/' + path):
        return send_from_directory('www/', path)
    else:
        #return send_from_directory('www/', path)
        return send_from_directory('www/', 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=80, host='0.0.0.0')
