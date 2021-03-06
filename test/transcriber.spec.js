const assert = require('assert');
const nock = require('nock');
const path = require('path');
const config = require('../config.js');
const transcribe = require('../src/transcriber.js');

describe('youtube_transcriber', () => {
    it('can transcribe video', async () => {

        // Initialize
        const {youtubeBaseUrl, videoSuffixUrl} = config;
        const videoId = 'someVideoId';

        nock(youtubeBaseUrl)
            .log(console.log)
            .get(videoSuffixUrl)
            .query({
                v: videoId,
                lang: "en"
            })
            .replyWithFile(200, path.join(__dirname, '/transcribe_examples/basic.xml'));

        nock(youtubeBaseUrl)
            .log(console.log)
            .get(videoSuffixUrl)
            .query({
                type: "list",
                v: videoId
            })
            .replyWithFile(200, path.join(__dirname, '/transcribe_examples/languages.xml'));

        // Execute
        const transcription = await transcribe(videoId);

        // Assert
        assert(!!transcription);
        assert(!!transcription.language);
        assert(!!transcription.terms);
        assert.equal("en", transcription.language);
        assert.equal(transcription.terms.length, 6);
        assert.equal(transcription.terms[0].start, 2.1)
        assert.equal(transcription.terms[0].value, "welcome")
        assert.equal(transcription.terms[1].start, 2.1)
        assert.equal(transcription.terms[1].value, "to")
        assert.equal(transcription.terms[2].start, 2.1)
        assert.equal(transcription.terms[2].value, "king's")
        assert.equal(transcription.terms[3].start, 2.1)
        assert.equal(transcription.terms[3].value, "landing")
        assert.equal(transcription.terms[4].start, 4)
        assert.equal(transcription.terms[4].value, "john")
        assert.equal(transcription.terms[5].start, 4)
        assert.equal(transcription.terms[5].value, "snow")
    });
});