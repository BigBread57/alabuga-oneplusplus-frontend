module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'model_name',
        message: 'What is the model name?',
      },
      {
        type: 'input',
        name: 'url',
        message: 'What is the URL of the model?',
      },
    ]
    return inquirer.prompt(questions).then((answers) => {
      const { model_name, url } = answers
      const path = `src/models/${model_name}`
      return { ...answers, path, url }
    })
  },
}
