//Importação de módulos
const axios = require('axios');

//Controller do blog
const blogController = {

    //Retorna os dados das postagens da API
    getPostagens: async (req, res) => {
        try {
            let page = 1;
            const loadPosts = async () => {
                try {
                    const response = await axios.get('http://nodeblog-api:8586/api/posts?page=1');
                    if(response.status == 200) {
                        const postData = response.data.posts.map(post => {
                            const formattedData = new Date(post.createdAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            return {...post, createdAt: formattedData}
                        });

                        res.render('blog/index', {posts: postData});
                    }
                } catch (error) {
                    req.flash('error_msg', 'Internal server error');
                }
            }

            loadPosts();
            
        } catch (error) {
            req.flash('error_msg', 'Internal server error');
            res.redirect('/');
        };

    }    
}

module.exports = blogController