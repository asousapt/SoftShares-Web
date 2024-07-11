import React from 'react';
import { Container, Typography, Box, Grid, Avatar } from '@mui/material';

const AboutUs = () => {
    return (
        <Container maxWidth="md" sx={{ backgroundColor: 'whitesmoke', borderRadius: 12}}>
            <Box textAlign="center" my={4}>
                <Typography variant="h2" component="h1" gutterBottom >
                    Sobre Nós
                </Typography>
                <Typography variant="h5" color="textSecondary">
                    A Conectar e Integrar Equipas por Todo o País
                </Typography>
            </Box>
            <Box my={4}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Nossa Visão
                </Typography>
                <Typography variant="body1" paragraph>
                    Na SoftShares, o nosso objetivo é criar um ambiente acolhedor e colaborativo para todos os colaboradores da Softinsa, independentemente da sua localização. Com vários escritórios em todo o país, compreendemos os desafios de integrar-se numa nova cidade e equipa, especialmente num ambiente de trabalho remoto. A nossa plataforma foi concebida para tornar esta transição suave e agradável, proporcionando informações abrangentes e recomendações para cada cidade.
                </Typography>
            </Box>
            <Box my={4}>
                <Typography variant="h4" component="h2" gutterBottom>
                    O que Oferecemos
                </Typography>
                <Typography variant="body1" paragraph>
                    A SoftShares oferece uma ampla gama de funcionalidades para ajudar os colaboradores a sentirem-se em casa e conectados:
                </Typography>
                <ul>
                    <Typography variant="body1" component="li">
                        Saúde: Encontre as melhores clínicas médicas, dentárias e veterinárias.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Desporto: Descubra ginásios, atividades ao ar livre e grupos desportivos como futebol, padel, squash e mais.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Formação: Aceda a informações sobre centros de formação, escolas e infantários.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Gastronomia: Explore os melhores restaurantes, centros comerciais e locais de alimentação.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Habitação/Alojamento: Encontre quartos para arrendar, casas para alugar, casas de férias e mais.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Transportes: Partilhe boleias, encontre opções de transportes públicos e mais.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Lazer: Conheça cinemas, parques e outras atividades de lazer.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Personalização: Adicione e sugira novas categorias que deseja ver na plataforma.
                    </Typography>
                </ul>
            </Box>
            <Box my={4}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Funcionalidades Interativas
                </Typography>
                <Typography variant="body1" paragraph>
                    A nossa plataforma foi desenhada para ser interativa e fácil de usar, permitindo aos colaboradores:
                </Typography>
                <ul>
                    <Typography variant="body1" component="li">
                        Comentar e solicitar recomendações aos colegas.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Partilhar e visualizar álbuns de momentos capturados.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Inscrever-se em grupos desportivos e outras atividades.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Partilhar eventos e atividades nas redes sociais.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Ver localizações de eventos via Google Maps.
                    </Typography>
                    <Typography variant="body1" component="li">
                        Aceder a um calendário de eventos com filtros por área.
                    </Typography>
                </ul>
            </Box>
            <Box my={4} textAlign="center">
                <Typography variant="h4" component="h2" gutterBottom>
                    Conheça a Equipa
                </Typography>
                <Grid container spacing={4} justifyContent="center" wrap="nowrap">
                    <Grid item xs={12} sm={6} md={4}>
                        <Box textAlign="center">
                            <Avatar src="https://via.placeholder.com/150" alt="António Sousa" sx={{ width: 150, height: 150, margin: '0 auto' }} />
                            <Typography variant="h6" component="h3" gutterBottom>
                                António Sousa
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Lider de Equipa
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box textAlign="center">
                            <Avatar src="https://via.placeholder.com/150" alt="Alexandre Marques" sx={{ width: 150, height: 150, margin: '0 auto' }} />
                            <Typography variant="h6" component="h3" gutterBottom>
                                Alexandre Marques
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                CTO
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box textAlign="center">
                            <Avatar src="https://via.placeholder.com/150" alt="John Smith" sx={{ width: 150, height: 150, margin: '0 auto' }} />
                            <Typography variant="h6" component="h3" gutterBottom>
                                Diogo Fonseca
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                CTO
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box textAlign="center">
                            <Avatar src="https://via.placeholder.com/150" alt="John Smith" sx={{ width: 150, height: 150, margin: '0 auto' }} />
                            <Typography variant="h6" component="h3" gutterBottom>
                                Diogo Pinto
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                CTO
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AboutUs;
