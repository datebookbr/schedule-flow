import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { fetchBlogArticle, ApiBlogArticle, FaqItem, ApiError, isApiFailure } from '@/lib/api';
import { getArticleBySlug, blogArticles as localArticles, BlogSection } from '@/data/blog-articles';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import { FaqPageSchema } from '@/components/SeoSchemas';

/** Renders a local-format section */
function LocalArticleContent({ section }: { section: BlogSection }) {
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
  const [apiArticle, setApiArticle] = useState<ApiBlogArticle | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [useLocal, setUseLocal] = useState(false);

  // Try local article as fallback
  const localArticle = slug ? getArticleBySlug(slug) : undefined;

  const loadData = async () => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    setUseLocal(false);

    const result = await fetchBlogArticle(slug);
    if (isApiFailure(result)) {
      // Try local fallback
      if (localArticle) {
        setUseLocal(true);
      } else {
        setError(result.error);
      }
      setLoading(false);
      return;
    }
    // If API returned empty/invalid article, fall back to local
    if (!result.data.title && localArticle) {
      setUseLocal(true);
    } else {
      setApiArticle(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  // Determine which data source to use
  const isLocal = useLocal && localArticle;
  const title = isLocal ? localArticle!.title : apiArticle?.title || '';
  const metaTitle = isLocal ? localArticle!.metaTitle : apiArticle?.metaTitle || title;
  const metaDescription = isLocal ? localArticle!.metaDescription : apiArticle?.metaDescription || '';
  const image = isLocal ? localArticle!.image : apiArticle?.image || '';
  const author = isLocal ? localArticle!.author : apiArticle?.author || '';
  const publishedAt = isLocal ? localArticle!.publishedAt : apiArticle?.publishedAt || '';
  const updatedAt = isLocal ? localArticle!.updatedAt : apiArticle?.updatedAt;
  const category = isLocal ? localArticle!.category : apiArticle?.category || '';
  const readTime = isLocal ? localArticle!.readTime : apiArticle?.readTime || 0;
  const faqs = isLocal ? undefined : apiArticle?.faqs;

  // Related articles from local data
  const related = localArticles.filter(a => a.slug !== slug).slice(0, 2);

  // Dynamic head
  useEffect(() => {
    if (!title) return;

    document.title = metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', metaDescription);

    const ogTags: Record<string, string> = {
      'og:title': metaTitle,
      'og:description': metaDescription,
      'og:url': `https://datebook.com.br/blog/${slug}`,
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

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://datebook.com.br/blog/${slug}`);

    // JSON-LD BlogPosting
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: metaDescription,
      image,
      author: { '@type': 'Organization', name: author },
      publisher: {
        '@type': 'Organization',
        name: 'Datebook',
        logo: { '@type': 'ImageObject', url: 'https://datebook.com.br/favicon.ico' }
      },
      datePublished: publishedAt,
      dateModified: updatedAt || publishedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://datebook.com.br/blog/${slug}`
      }
    };

    let script = document.querySelector('script[data-blog-jsonld]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-blog-jsonld', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      const s = document.querySelector('script[data-blog-jsonld]');
      if (s) s.remove();
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.remove();
    };
  }, [title, metaTitle, metaDescription, slug, image, author, publishedAt, updatedAt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-hero text-primary-foreground py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto animate-pulse space-y-4">
              <div className="h-4 bg-primary-foreground/20 rounded w-24" />
              <div className="h-10 bg-primary-foreground/20 rounded w-full" />
              <div className="h-6 bg-primary-foreground/20 rounded w-2/3" />
            </div>
          </div>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-hero text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao blog
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar artigo" />
          </div>
        </main>
      </div>
    );
  }

  if (!title) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* FAQPage Schema if article has FAQs */}
      {faqs && faqs.length > 0 && <FaqPageSchema faqs={faqs} />}

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
                {category}
              </span>
              <span className="flex items-center gap-1 text-xs text-primary-foreground/70">
                <Clock className="w-3 h-3" />
                {readTime} min de leitura
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {image && (
        <div className="container mx-auto px-4 -mt-8">
          <div className="max-w-3xl mx-auto">
            <img
              src={image}
              alt={title}
              className="w-full aspect-[2/1] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          {isLocal && localArticle ? (
            // Render from local structured content
            localArticle.content.map((section, index) => (
              <LocalArticleContent key={index} section={section} />
            ))
          ) : apiArticle?.content ? (
            // Render HTML content from API
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: apiArticle.content }}
            />
          ) : null}

          {/* Article FAQs section */}
          {faqs && faqs.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Perguntas Frequentes
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`article-faq-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-left text-base font-medium text-foreground hover:text-primary hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
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
            <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
