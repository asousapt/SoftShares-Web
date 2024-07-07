const emailController = require('../controllers/email');

const suporteController =  {
    enviarEmailSuporte: async (req, res) => {
        const { email, assunto, mensagem } = req.body;

        try {
            const resposta = await emailController.sendEmail(email, assunto, mensagem);
            

            res.status(200).json({ message: 'Email enviado com sucesso', data: true});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao enviar email', data: error.message });
        }
    }
}
module.exports = suporteController;