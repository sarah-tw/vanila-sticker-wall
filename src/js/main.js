import _ from 'lodash';
import $ from 'jquery';

//import Sticker from './sticker';


let StickerWall = () => {
	const stickerTmpl = _.template($('#sticker_template').html());
	let stickers = JSON.parse(localStorage.getItem("stickers")) || [];

	let initStickerListDom = () => {
		let initHtml = '';
		_.orderBy(stickers, ['id'], ['desc']).map((sticker) => {
			initHtml += stickerTmpl({'title': sticker.title, 'id': sticker.id})
		})
		$('#sticker_list').prepend(initHtml);
	}

	let addSticker = () => {
		let newSticker = stickerTmpl({'title': '', 'id': stickers.length});
		$('#sticker_list').prepend(newSticker);
		$('#sticker_list .sticker-wrapper:first-child .sticker').focus();
	}

	let onKeydownHandler = (e) => {
		if(e.which == 13) {
			e.preventDefault();
			let title = _.trim(e.target.value.replace(/[\n\t]/g, ''));
			const id = parseInt(e.target.dataset.id);
			let currentSticker = _.filter(stickers, {id: id});
			if(_.isEmpty(currentSticker)) {
				stickers.push({id: stickers.length, title: title});
			} else {
				_.forEach(stickers, (sticker) => {
					if(sticker.id === id){sticker['title'] = title}
				});
			}
			localStorage.setItem("stickers", JSON.stringify(stickers));
			$(e.target).blur();
			} else if(e.shiftKey && e.which === 78) {
				e.preventDefault();
				addSticker();
			}
	}

	initStickerListDom();

	$('#new_sticker').on('click', addSticker);

	$('body').on('keydown', '.sticker', onKeydownHandler);
	$('body').on('keydown', onKeydownHandler);

};

StickerWall();
