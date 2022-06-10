////// Constants declaration Start //////

// CodeSandbox Projects
const sandboxProjects = [
	{
		src: 'https://codesandbox.io/embed/todo-app-sdhkqz?fontsize=14&hidenavigation=1&theme=dark',
		title: 'Todo App'
	},
	{
		src: 'https://codesandbox.io/embed/snake-game-bxpe7m?fontsize=14&hidenavigation=1&theme=dark&view=preview',
		title: 'Snake game'
	},
	{
		src: 'https://codesandbox.io/embed/quiz-game-m8u0qk?fontsize=14&hidenavigation=1&theme=dark',
		title: 'Quiz game'
	},
	{
		src: 'https://codesandbox.io/embed/react-youtube-clone-app-1lru6m?fontsize=14&hidenavigation=1&theme=dark&view=editor',
		title: 'React Youtube Clone App'
	},
	{
		src: 'https://codesandbox.io/embed/react-quiz-app-rngy7f?fontsize=14&hidenavigation=1&theme=dark&view=preview',
		title: 'React Quiz game'
	},
	{
		src: 'https://codesandbox.io/embed/tender-bash-50uyx4?fontsize=14&hidenavigation=1&theme=dark',
		title: 'React Weather App'
	}
];

const mySkills = ['Ashish Mule', 'Full Stack Developer', 'Web Developer'];
const myResume = '/resume/Ashish_resume.pdf';
const menuList = ['About', 'Project', 'Resume', 'Contact'];

// Github Open Source Projects
const openSourceProjects = [
	{
		link: 'https://coderx707.github.io/tools-utilities/',
		img: 'images/project/tools-utils01.png'
	},
	{
		link: 'https://mockx-api.herokuapp.com/',
		img: 'images/project/mock-api.png'
	},
	{
		link: 'https://coderx707.github.io/tools-utilities/',
		img: 'images/project/tools-utils.png'
	}
];

function random_item(items) {
	return items[Math.floor(Math.random() * items.length)];
}

const shuffleArray = (array) => {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex]
		];
	}
	return array;
};
////// Constants declaration End //////
