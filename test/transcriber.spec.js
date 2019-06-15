const assert = require('assert');
const nock = require('nock');
const transcribe = require('../src/transcriber.js');

describe('youtube_transcriber', () => {
    it('can transcribe video', () => {
        const youtubeBaseUrl = 'https://www.youtube.com/';
        const videoSuffixUrl = 'watch?v=someVideoId';
        const videoUrl = `${youtubeBaseUrl}${videoSuffixUrl}`;
        nock(youtubeBaseUrl)
            .get(videoSuffixUrl)
            .replyWithFile(200, '../transcribe_examples/basic.xml');
        
        const transcription = transcribe(videoUrl);

        assert(!!transcription);
        assert(!!transcription.words);
        assert.equal(transcription.words.length, 3);
        assert.equal(transcription.words[0].start, 2.1)
        assert.equal(transcription.words[0].end, 2.4)
        assert.equal(transcription.words[0].value, "welcome")
        assert.equal(transcription.words[1].start, 4)
        assert.equal(transcription.words[1].end, 4.8)
        assert.equal(transcription.words[1].value, "john")
        assert.equal(transcription.words[2].start, 5)
        assert.equal(transcription.words[2].end, 5.6)
        assert.equal(transcription.words[2].value, "snow")
    });
});