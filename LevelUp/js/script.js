// ============= Нативный JS =======================================
// =====>>> Подключить слайдер <<<<======
//==================>>> Инициализируем Swiper <<<==========================================================
new Swiper('.testimonials-slider', {
	//==============>>> Основные настройки слайда <<<============================================================
		// >>> Количество слайдов для показа (Можно указывать не целые числа 2.5 или значени auto) <<<
	slidesPerView: 1,

		// >>> Количество пролистываемых слайдов <<<
	slidesPerGroup: 1,

		// >>> Отступ между слайдами <<<
	spaceBetween: 0,

		// >>> Переключение при клике на слайд <<<
	// slideToClickedSlide: true,

		// >>> Стартовый слайд <<<
	initialSlide: 0,

		// >>> Бесконечный слайдер <<<
	loop: true,

		// >>> Автовысота <<<
	autoHeight: true,
	//====================================================================================
	//=================>>> Управление слайдером <<<=======================================
	//====================================================================================
	//============>>> Навигация <<<==============================
	//======>>> Буллеты, текущее положение, програссбар <<<======
	pagination: {
		el: '.swiper-pagination',

	//==========>>> Буллеты <<<==================================
		clickable: true,
	//==========>>> Динамические буллеты <<<=====================
		// dynamicBullets: true,
	//==========>>> Кастомные буллеты <<<========================
		// renderBullet: function (index, className) {
		// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
		// },
	//==========>>> Фракция (текущая страница 1/5) <<<===========
		// type: 'fraction',
	//==========>>> Кастомный вывод фракции <<<==================
		// renderFraction: function (currentClass, totalClass) {
			// return 'Фото <span class="' + currentClass + '"></span>' +
			// ' из ' +
			// '<span class="' + totalClass + '"></span>';
		// },
	//==========>>> Прогрессбар <<<==============================
		// type: 'progressbar',
	},

	//===========>>> Управление Клавиатурой <<<==================
	keyboard: {
			// >>> Влючить\Выключить <<<
		enabled:true,
			// >>> Влючить\Выключить только когда слайдер в приделах вьюпорта <<<
		onlyInViewport: true,
			// >>> Влючить\Выключить управление клавишами pageUp, pageDown <<<
		pageUpDown: true,
	},

	//==================================================================================================
	//============>>> Настройки которые почти всегда включены <<<=======================================
	//==================================================================================================
	// >>> Отключить предзагрузку картинок <<<
	preloadImage: false,
	// >>> Lazy loading (подгрузка кртинок) <<<
	lazy: {
		// >>> Подгружить на старте переключения слайда <<<
		loadOnTransitionStart: false,
		// >>> Подгрузить предыдущую и следующую картинки <<<
		loadPrevNext: false,
	},

	//>>> Отключение функционала если слайдов меньше чем нужно <<<
	watchOverflow: true,

	// >>> Слежка за видимыми слайдами <<<
	watchSlidesProgress: true,

	// >>> Добавление класса видимым слайдам <<<
	watchSlidesVisibility: true,

	// >>> Обновить свайпер при изменении элементов слайдера <<<
	observer: true,

	// >>> Обновить свайпер при изменении родительских элементов слайдера <<<
	observeParents: true,

	// >>> Обновить свайпер при изменении дочерних элементов слайда <<<
	observeSlideChildren: true,
	//======================================================================================================
});
// =====>>> Плавный скролл, Активные пункты меню, Появление меню <<<<======
// Плавный скролл =================================================
document.querySelectorAll('a[href^="#"').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        let href = this.getAttribute('href').substring(1);

        const scrollTarget = document.getElementById(href);
        // Учитываем высоту шапки (указав ее класс)====
        const topOffset = 0;
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});
// =====>>> Динамический Адаптив <<<<======
// data-da="куда,когда,какой"
// Пример <div data-da=".content__column-garden,992,2" class="content__block">Я Коля</div>

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  const _this = this;
  // массив объектов
  this.оbjects = [];
  this.daClassname = "_dynamic_adapt_";
  // массив DOM-элементов
  this.nodes = document.querySelectorAll("[data-da]");

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const data = node.dataset.da.trim();
    const dataArray = data.split(",");
    const оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
    оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects);

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
    return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
  }, this);
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index;
  });

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i];
    const mediaSplit = String.prototype.split.call(media, ',');
    const matchMedia = window.matchMedia(mediaSplit[0]);
    const mediaBreakpoint = mediaSplit[1];

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint;
    });
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });
    this.mediaHandler(matchMedia, оbjectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
    }
  }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);
  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element);
    return;
  }
  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element);
    return;
  }
  destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parent.insertAdjacentElement('beforeend', element);
  }
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === "min") {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return -1;
        }

        if (a.place === "last" || b.place === "first") {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return 1;
        }

        if (a.place === "last" || b.place === "first") {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

const da = new DynamicAdapt("max");
da.init();
// =================================================================
let time = 3599;
const countDownEl = document.getElementById("countdown");

setInterval(updateCountdown, 1000);

function updateCountdown() {
	let hour = Math.floor(time / 3600)
	hour = hour < 10 ? "0" + hour:
	hour;
	let minutes = Math.floor(time / 60)
	minutes = minutes < 10 ? "0" + minutes:
	minutes;
	let seconds = time % 60;
	seconds = seconds < 10 ? "0" + seconds:
	seconds;
	countDownEl.innerHTML = `${hour}:${minutes}:${seconds}`;
	time--;
};