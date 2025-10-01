module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'list',
        name: 'page_name',
        message: 'Which main page would you like to generate?',
        choices: ['journal', 'shop', 'rank', 'news'],
      },
    ]

    return inquirer.prompt(questions).then((answers) => {
      const { page_name } = answers
      const path = `src/app/[locale]/(main)/${page_name}`
      return { ...answers, path }
    })
  },
}
