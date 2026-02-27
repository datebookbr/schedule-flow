import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { blogArticles } from '@/data/blog-articles';
import { Button } from '@/components/ui/button';

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      {/* SEO: only one H1 */}
      <header className="bg-gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Voltar para o site
          </Link>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Blog Datebook</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Dicas e estratégias para salões de beleza e barbearias
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
              Conteúdo prático sobre gestão, agendamento e crescimento para profissionais da beleza.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {article.readTime} min de leitura
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-sm font-semibold text-primary group-hover:underline flex items-center gap-1">
                    Ler artigo
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Blog CTA */}
      <section className="bg-gradient-subtle py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Pronto para profissionalizar sua agenda?
          </h2>
          <p className="text-muted-foreground mb-8">
            O Datebook é o sistema de agendamento com WhatsApp integrado feito para salões de beleza e barbearias.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/#precos">
              <Button variant="hero" size="lg">
                Ver planos e preços
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Conhecer o Datebook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Datebook. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <Link to="/blog" className="hover:text-primary transition-colors font-medium text-foreground">Blog</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
