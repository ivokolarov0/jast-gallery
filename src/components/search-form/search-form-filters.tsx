import { useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SearchFormFilters = ({ children, hideFilters }: any) => {
  const { t } = useTranslation();
  const { search, page, attributes, userGameTags, taxons, source } = useSearch<any>({ from: '/account'});
  const navigate = useNavigate({ from: '/account' })
  const { handleSubmit, register } = useForm<any>({
    defaultValues: {
      attributes: attributes ? attributes.split(',') : [],
      userGameTags: userGameTags ? userGameTags.split(',') : [],
      taxons: taxons ? taxons.split(',') : []
    }
  });
  const filters = [
    {
      title: t('system'),
      name: 'attributes',
      items: [
        {
          title: t('Windows'),
          value: '4_3e046090-03f4-11ec-b2a5-5a010385a85f'
        },
        {
          title: t('Mac'),
          value: '4_d2507354-049b-11ec-9e35-5a000385a85f'
        },
        {
          title: t('Linux'),
          value: '4_d2508b50-049b-11ec-875c-5a000385a85f'
        }
      ]
    },
    {
      title: t('tag'),
      name: 'userGameTags',
      items: [
        {
          title: t('love-it'),
          value: 'love_it'
        },
        {
          title: t('finished'),
          value: 'finished'
        },
        {
          title: t('next-to-play'),
          value: 'next_to_play'
        },
        {
          title: t('recommended'),
          value: 'recommended'
        }
      ]
    },
    {
      title: t('type'),
      name: 'taxons',
      items: [
        {
          title: t('games'),
          value: 'games'
        },
        {
          title: t('dlc'),
          value: 'dlc'
        },
      ]
    }
  ];

  const onSubmit = (values: any) => {
    const entries = Object.entries(values).reduce((acc: { [key: string]: string }, [key, value]) => {
      if(Array.isArray(value) && value.length) {
        acc[`${key}`] = value.join(',');
      }
      return acc;
    }, {});

    navigate({ search: { page: 1, search, source, ...entries } });
  }

  const handleReset = () => navigate({ search: { page, search, source } });

  return (
    <div className="filters">
      {children}
      {!hideFilters && 
        <form onSubmit={handleSubmit(onSubmit)}>
          {filters.map((filter, index) => (
            <div className="filter" key={index}>
              <div className="filter__title">{filter.title}:</div>
              <div className="filter__items">
                {filter.items.map((item, index) => (
                  <div className="custom-checkbox" key={index}>
                    <label>
                      <input
                        type="checkbox"
                        value={item.value}
                        {...register(`${filter.name}[]`)} 
                      />
                      <span></span>
                      {item.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="filters__cta">
            <button type="reset" className="btn btn--empty" onClick={handleReset}>{t('reset')}</button>
            <button type="submit" className="btn">{t('apply')}</button>
          </div>
        </form>
      }
    </div>
  )
}

export default SearchFormFilters