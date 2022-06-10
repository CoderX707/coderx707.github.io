////// vue app //////
const { ref, createApp } = Vue;

createApp({
	mounted() {
		// COLOR MODE
		$('.color-mode').click(function () {
			$('.color-mode-icon').toggleClass('active');
			$('body').toggleClass('dark-mode');
		});
		// HEADER
		$('.navbar').headroom();
		// SMOOTHSCROLL
		$(function () {
			$('.nav-link, .custom-btn-link').on('click', function (event) {
				var $anchor = $(this);
				$('html, body')
					.stop()
					.animate(
						{
							scrollTop: $($anchor.attr('href')).offset().top - 49
						},
						1000
					);
				event.preventDefault();
			});
		});
		// TOOLTIP
		$('.social-links a').tooltip();
	},
	data() {
		return {
			menuItems: menuList
		};
	}
}).mount('#navbarNav');

createApp({
	data() {
		return {
			skills: shuffleArray(mySkills),
			resume: myResume
		};
	}
}).mount('#About');

createApp({
	mounted() {
		// PROJECT CAROUSEL
		$('.owl-carousel').owlCarousel({
			items: 1,
			loop: true,
			margin: 10,
			nav: true,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true
		});
	},
	data() {
		return {
			codeSandboxProject: random_item(sandboxProjects),
			projects: shuffleArray(openSourceProjects)
		};
	},
	methods: {
		nextSandboxProject() {
			const index = sandboxProjects.findIndex(
				(pr) => pr.src === this.codeSandboxProject.src
			);
			this.codeSandboxProject =
				sandboxProjects.length - 1 !== index
					? sandboxProjects[index + 1]
					: this.codeSandboxProject;
		},
		prevSandboxProject() {
			const index = sandboxProjects.findIndex(
				(pr) => pr.src === this.codeSandboxProject.src
			);
			this.codeSandboxProject =
				0 !== index ? sandboxProjects[index - 1] : this.codeSandboxProject;
		}
	}
}).mount('#Project');
