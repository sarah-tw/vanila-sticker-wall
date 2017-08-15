import _ from 'lodash';
import $ from 'jquery';
import Sticker from './sticker';

//import Sticker from './sticker';


let StickerWall = () => {
	const stickerTmpl = _.template($('#sticker_template').html());
	let stickers = JSON.parse(localStorage.getItem("stickers")) || [];
	
	let initStickerListDom = () => {
		let initHtml = '';
		_.orderBy(stickers, ['id'], ['desc']).map((sticker) => {
			initHtml += stickerTmpl({sticker: sticker});
		})
		$('#sticker_list').append(initHtml);
	}

	let addSticker = () => {
		let sticker = new Sticker("", "default");
		let newSticker = stickerTmpl({sticker: sticker});
		$('.sticker-wrapper:first-child').after(newSticker);
		$('#sticker_list .sticker-wrapper:nth-child(2) .sticker').focus();
	}

	let deleteSticker = (e) => {
		if(confirm("Would you like to delete this sticker?")){
			const id = parseInt(e.target.dataset.id);
			const updatedStickers = stickers.filter(s => s.id !== parseInt(id));
			localStorage.setItem("stickers", JSON.stringify(updatedStickers));
			$(e.target).closest('.sticker-wrapper').remove();
		}
	}
	let saveSticker = (e) => {
		let title = _.trim(e.target.value.replace(/[\n\t]/g, ''));
		let id = parseInt(e.target.dataset.id);
		if(!id) {
			id = parseInt(Date.now());
			let sticker = new Sticker(title, "default", id);
			e.target.dataset.id = id;
			stickers.push(sticker);
		} else {
			_.forEach(stickers, (sticker) => {
				if(sticker.id === id){sticker.title = title}
			});
		}
		localStorage.setItem("stickers", JSON.stringify(stickers));
	}

	let onKeydownHandler = (e) => {
		if(e.key == 'Enter' && $(e.target).hasClass('sticker')) {
			e.preventDefault();
			$(e.target).blur(); // blur will trigger save;
		} else if(e.shiftKey && e.key === 'N') {
			e.preventDefault();
			addSticker();
		}
	}

	initStickerListDom();

	$('#new_sticker').on('click', addSticker);
	$('.delete').on('click', deleteSticker);

	$('body').on('keydown', onKeydownHandler);
	//$('body').on('keydown', '.sticker', onKeydownHandler);
	$('body').on('blur', '.sticker', saveSticker);

};

StickerWall();
