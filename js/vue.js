////// vue app //////
const { ref, createApp } = Vue;

createApp({
  data() {
    return {
      menuItems: menuList,
      codeSandboxProject: random_item(sandboxProjects),
      constantCodeSandboxProjectSrc: '',
      projects: shuffleArray(openSourceProjects),
      skills: shuffleArray(mySkills),
      resume: myResume,
      isDarkMode: false,
    };
  },
  mounted() {
    this.constantCodeSandboxProjectSrc = this.codeSandboxProject.src;
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
              scrollTop: $($anchor.attr('href')).offset().top - 49,
            },
            1000
          );
        event.preventDefault();
      });
    });
    // TOOLTIP
    $('.social-links a').tooltip();
    // PROJECT CAROUSEL
    $('.owl-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
    });
  },

  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.iFrameSrcChangeAsPerTheme();
      $('.color-mode-icon').toggleClass('active');
      $('body').toggleClass('dark-mode');
    },
    nextSandboxProject() {
      const index = sandboxProjects.findIndex(
        (pr) => pr.src === this.codeSandboxProject.src
      );
      this.codeSandboxProject =
        sandboxProjects.length - 1 !== index
          ? sandboxProjects[index + 1]
          : this.codeSandboxProject;
      this.constantCodeSandboxProjectSrc = this.codeSandboxProject.src;
      this.iFrameSrcChangeAsPerTheme();
    },
    prevSandboxProject() {
      const index = sandboxProjects.findIndex(
        (pr) => pr.src === this.codeSandboxProject.src
      );
      this.codeSandboxProject =
        0 !== index ? sandboxProjects[index - 1] : this.codeSandboxProject;
      this.constantCodeSandboxProjectSrc = this.codeSandboxProject.src;
      this.iFrameSrcChangeAsPerTheme();
    },
    iFrameSrcChangeAsPerTheme() {
      this.codeSandboxProject.src = this.constantCodeSandboxProjectSrc;
      this.codeSandboxProject.src =
        this.codeSandboxProject.src +
        `&theme=${this.isDarkMode ? 'dark' : 'light'}`;
    },
  },
}).mount('#body');
