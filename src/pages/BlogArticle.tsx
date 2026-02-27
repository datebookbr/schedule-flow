import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { getArticleBySlug, blogArticles, BlogSection } from '@/data/blog-articles';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

function ArticleContent({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'h2':
      return <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">{section.text}</h2>;
    case 'h3':
      return <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{section.text}</h3>;
    case 'p':
      return <p className="text-muted-foreground leading-relaxed mb-4">{section.text}</p>;
    case 'ul':
      return (
        <ul className="space-y-2 mb-6 ml-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'cta':
      return (
        <div className="my-8 p-6 bg-primary/5 border border-primary/15 rounded-2xl text-center">
          <Link to={section.ctaLink || '/'}>
            <Button variant="default" size="lg">
              {section.ctaText}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Related articles (exclude current)
  const related = blogArticles.filter(a => a.slug !== article.slug).slice(0, 2);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    image: article.image,
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'Datebook',
      logo: { '@type': 'ImageObject', url: 'https://datebook.com.br/favicon.ico' }
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://datebook.com.br/blog/${article.slug}`
    }
  };

  return (
    <>
      {/* Dynamic head via useEffect */}
      <DynamicHead
        title={article.metaTitle}
        description={article.metaDescription}
        url={`https://datebook.com.br/blog/${article.slug}`}
        image={article.image}
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-background">
        {/* Article Header */}
        <header className="bg-gradient-hero text-primary-foreground py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm mb-8">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao blog
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold bg-primary-foreground/15 backdrop-blur-sm px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-primary-foreground/70">
                  <Clock className="w-3 h-3" />
                  {article.readTime} min de leitura
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="container mx-auto px-4 -mt-8">
          <div className="max-w-3xl mx-auto">
            <img
              src={article.image}
              alt={article.title}
              className="w-full aspect-[2/1] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Article Body */}
        <main className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto">
            {article.content.map((section, index) => (
              <ArticleContent key={index} section={section} />
            ))}
          </article>
        </main>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="bg-gradient-subtle py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-8">Artigos relacionados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/blog/${rel.slug}`}
                      className="group bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-snug mb-2">
                          {rel.title}
                        </h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rel.readTime} min
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Datebook. Todos os direitos reservados.</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <Link to="/" className="hover:text-primary transition-colors">Início</Link>
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

/** Dynamically sets document title and meta tags */
function DynamicHead({ title, description, url, image, jsonLd }: {
  title: string;
  description: string;
  url: string;
  image: string;
  jsonLd: object;
}) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // OG tags
    const ogTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:url': url,
      'og:image': image,
      'og:type': 'article',
    };
    Object.entries(ogTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Twitter tags
    const twitterTags: Record<string, string> = {
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
    };
    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) tag.setAttribute('content', content);
    });

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // JSON-LD
    let script = document.querySelector('script[data-blog-jsonld]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-blog-jsonld', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      // Cleanup JSON-LD on unmount
      const s = document.querySelector('script[data-blog-jsonld]');
      if (s) s.remove();
    };
  }, [title, description, url, image, jsonLd]);

  return null;
}
