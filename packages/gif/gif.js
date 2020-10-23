// jshint esversion: 9

const axios = require('axios');

async function _command(params = {}, commandText, secrets = {}) {
	const gifRequest = params.gif_request; //The word you search for the gif
	let textForGif = params.text_for_gif; //The optional text under the post.

	if (params.text_for_gif == null) textForGif = ' ';

	const gifTotal = await axios.get(
		`https://api.giphy.com/v1/gifs/search?api_key=` +
			secrets.giphy_key +
			`&q=` +
			gifRequest +
			`&limit=1&offset=2&rating=g&lang=en`
	);

	const gifValue = gifTotal.data.data[0].id; //the id for the gif.

	return {
		response_type: 'in_channel',
		blocks: [
			{
				type: 'image',
				alt_text: 'you have 20 seconds to comply',
				image_url: 'https://media.giphy.com/media/' + gifValue + '/giphy.gif',
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: textForGif,
				},
				block_id: 'text1',
			},
		],
	};
}

const main = async (args) => ({
	body: await _command(
		args.params,
		args.commandText,
		args.__secrets || {}
	).catch((error) => ({
		response_type: 'ephemeral',
		text: `Error: ${error.message}`,
	})),
});

module.exports = main;
