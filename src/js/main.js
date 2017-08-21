import _ from 'lodash';
import $ from 'jquery';
import Sticker from './sticker';

//import Sticker from './sticker';


let StickerWall = () => {
	const stickersTmpl = _.template($('#stickers_template').html());
	let stickers = JSON.parse(localStorage.getItem("stickers")) || [];
	
	let renderStickers = (stickers) => {
		let initHtml = stickersTmpl({stickers: stickers});
		$('#sticker_list').html(initHtml);
	}

	let addSticker = () => {
		let sticker = new Sticker("", "life");
		let newSticker = stickersTmpl({stickers: [sticker]});
		$('#sticker_list').prepend(newSticker);
		$('#sticker_list .sticker-wrapper:first-child .sticker').focus();
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
			if(sticker.id === parseInt(id)){sticker.tag = e.target.innerText.toLowerCase() }
		});
		$('.tags-wrapper').hide();
		updateSticker(stickers);
		renderStickers(stickers);
	}

	let filterByTag = (e) => {
		const isCurrentActive = $(e.target).hasClass('active');
		let filteredStickers;
		if(isCurrentActive) {
			filteredStickers = stickers;
		}else {
			$('.tag-filter .tag').removeClass('active');
			const tag = $(e.target).text().toLowerCase();
			filteredStickers = _.filter(stickers, sticker => sticker.tag === tag)
		}
		$(e.target).toggleClass('active');
		renderStickers(filteredStickers);
	}

	renderStickers(stickers);

	$('#new_sticker').on('click', addSticker);
	$('.delete').on('click', deleteSticker);

	$('body').on('keydown', onKeydownHandler);
	$('body').on('blur', '.sticker', saveSticker);

	$('body').on('click', '.edit-tag', showTagBox);
	$('body').on('click', '.tag', changeTag);

	$('body').on('click', '.tag-filter .tag', filterByTag);

};

StickerWall();
