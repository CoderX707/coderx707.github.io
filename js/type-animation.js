function typingAnimation(isDarkMode = false) {
  const div = document.getElementById('skills-experience');
  div.innerHTML = '';
  const typeWriter = new TypeWriter(div, {
    loop: true,
    title: 'Experience & Education',
    isDarkTheme: isDarkMode,
  });

  typeWriter
    .typeString('Experiences,')
    .pauseFor(500)
    .typeString('\n\n🟣 KCS - Krish Compusoft Services, Pune, IN | Software Engineer')
    .pauseFor(200)
    .typeString('\n\tDate from FEB 2022 To Present')
    .pauseFor(200)
    .typeString('\n\n🟣 Elements Software, Kolhapur, IN | Full Stack Developer')
    .pauseFor(200)
    .typeString('\n\tDate from JAN 2020 TO JAN 2022')
    .pauseFor(2000)
    .deleteAll(10)
    .typeString('Education,')
    .pauseFor(500)
    .typeString('\n\n🟣 Bachelor of Computer Application (BCA) | Computer')
    .pauseFor(200)
    .typeString('\n\tCOMPLETED: FEB - 2021, ISBM University')
    .pauseFor(200)
    .typeString('\n\n🟣 Higher Secondary Certificate (HSC) | Science')
    .pauseFor(200)
    .typeString('\n\tCOMPLETED: FEB - 2016')
    .pauseFor(200)
    .typeString('\n\tMaharashtra High School & jr. College, Kolhapur')
    .pauseFor(200)
    .typeString('\n\n🟣 Secondary School Certificate (SSC) | Technical')
    .pauseFor(200)
    .typeString('\n\tCOMPLETED: FEB - 2012')
    .pauseFor(200)
    .typeString('\n\tMaharashtra High School & jr. College, Kolhapur')
    .pauseFor(2000)
    .deleteAll(10)
    .start();
}
