const assert = require('assert');
const nock = require('nock');
var path = require('path');
const transcribe = require('../src/transcriber.js');

describe('youtube_transcriber', () => {
    it('can transcribe video', async () => {

        // Initialize
        const youtubeBaseUrl = 'https://www.youtube.com';
        const videoSuffixUrl = '/timedtext';
        const videoId = 'someVideoId';
        const videoUrl = `${youtubeBaseUrl}${videoSuffixUrl}?v=${videoId}`;
        nock(youtubeBaseUrl)
            .log(console.log)
            .get(videoSuffixUrl)
            .query({
                v: videoId
            })
            .replyWithFile(200, path.join(__dirname, '/transcribe_examples/basic.xml'));
        
        // Execute
        const transcription = await transcribe(videoUrl);

        // Assert
        assert(!!transcription);
        assert(!!transcription);
        assert.equal(transcription.length, 6);
        assert.equal(transcription[0].start, 2.1)
        assert.equal(transcription[0].value, "welcome")
        assert.equal(transcription[1].start, 2.1)
        assert.equal(transcription[1].value, "to")
        assert.equal(transcription[2].start, 2.1)
        assert.equal(transcription[2].value, "king's")
        assert.equal(transcription[3].start, 2.1)
        assert.equal(transcription[3].value, "landing")
        assert.equal(transcription[4].start, 4)
        assert.equal(transcription[4].value, "john")
        assert.equal(transcription[5].start, 4)
        assert.equal(transcription[5].value, "snow")
    });
});