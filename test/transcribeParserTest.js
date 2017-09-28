var assert = require('assert');
var transcriber = require('../src/transcriber.js');

describe('youtube_transcriber', () => {
    it('can transcribe video', () => {
        const transcribtion = transcriber.transcribe('https://www.youtube.com/watch?v=yqr6yLyuHQA');
    });
});