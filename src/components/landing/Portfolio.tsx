import { useEffect, useState } from 'react';
import { fetchPortfolio, PortfolioData, ApiError, isApiFailure } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Star } from 'lucide-react';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

export const Portfolio = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchPortfolio();
    if (isApiFailure(result)) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ApiErrorDisplay error={error} onRetry={loadData} title="Erro ao carregar Portfólio" />
        </div>
      </section>
    );
  }

  if (!data || !data.ativo || data.estabelecimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {data.titulo}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.subtitulo}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.estabelecimentos.map((estabelecimento) => (
            <Card 
              key={estabelecimento.id} 
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                    <AvatarImage 
                      src={estabelecimento.imagem} 
                      alt={estabelecimento.nome}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {estabelecimento.nome.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg truncate group-hover:text-primary transition-colors">
                      {estabelecimento.nome}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {estabelecimento.segmento}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{estabelecimento.cidade}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {estabelecimento.descricao}
                </p>

                {estabelecimento.avaliacao && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{estabelecimento.avaliacao}</span>
                    <span className="text-muted-foreground text-sm">
                      ({estabelecimento.totalAvaliacoes} avaliações)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
