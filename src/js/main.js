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
		let sticker = new Sticker("", "life");
		let newSticker = stickerTmpl({sticker: sticker});
		$('.sticker-wrapper:first-child').after(newSticker);
		$('#sticker_list .sticker-wrapper:nth-child(2) .sticker').focus();
	}

	let updateSticker = (stickers) => {
		localStorage.setItem("stickers", JSON.stringify(stickers));
	}

	let deleteSticker = (e) => {
		if(confirm("Would you like to delete this sticker?")){
			let id = $(e.target).closest('.sticker-wrapper')[0].dataset.id;
			const updatedStickers = stickers.filter(s => s.id !== parseInt(id));
			updateSticker(updatedStickers);
			$(e.target).closest('.sticker-wrapper').remove();
		}
	}
	let saveSticker = (e) => {
		let title = _.trim(e.target.value.replace(/[\n\t]/g, ''));
		let id = $(e.target).closest('.sticker-wrapper')[0].dataset.id;
		id = parseInt(id);
		if(!id) {
			id = parseInt(Date.now());
			let sticker = new Sticker(title, "life", id);
			e.target.dataset.id = id;
			stickers.push(sticker);
		} else {
			_.forEach(stickers, (sticker) => {
				if(sticker.id === id){sticker.title = title}
			});
		}
		updateSticker(stickers);
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



	let showTagBox = (e) => {
		$('.tags-wrapper').show();
		let id = $(e.target).closest('.sticker-wrapper')[0].dataset.id;
		$('.tags-wrapper')[0].dataset["id"] = id;
	}

	let changeTag = (e) => {
		let id = $('.tags-wrapper')[0].dataset.id;
		_.forEach(stickers, (sticker) => {
			if(sticker.id === parseInt(id)){sticker.tag = e.target.innerText }
		});
		updateSticker(stickers);
		$('.tags-wrapper').hide();
	}

	initStickerListDom();

	$('#new_sticker').on('click', addSticker);
	$('.delete').on('click', deleteSticker);

	$('body').on('keydown', onKeydownHandler);
	$('body').on('blur', '.sticker', saveSticker);

	$('body').on('click', '.edit-tag', showTagBox);
	$('body').on('click', '.tag', changeTag);

};

StickerWall();
