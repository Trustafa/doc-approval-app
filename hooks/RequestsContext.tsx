import { RequestFilters, RequestType } from '@/app/_types/request';
import { getRequests } from '@/app/api/_client/request.client';
import { RequestResponse } from '@/app/api/_services/request.service';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type RequestsContextType = {
  data: RequestResponse[];
  total: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  filters: RequestFilters;
  setFilters: (filters: RequestFilters) => void;
  isLoading: boolean;
};

const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context)
    throw new Error('useRequests must be used within RequestsProvider');
  return context;
};

export const RequestsProvider = ({
  children,
  requestType,
}: {
  children: ReactNode;
  requestType: RequestType;
}) => {
  const [data, setData] = useState<RequestResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<RequestFilters>({});
  const pageSize = 5;
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getRequests(requestType, filters, {
      page: page,
      pageSize: pageSize,
    });

    if (!res.success) {
      console.error('Unable to fetch requests');
      return;
    }

    setData(res.data);
    setTotal(res.count);
    setIsLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
  }, [page]);

  useEffect(() => {
    const load = async () => {
      setPage(0);
      await fetchData();
    };
    load();
  }, [filters]);

  return (
    <RequestsContext.Provider
      value={{
        data,
        total,
        page,
        setPage,
        pageSize,
        filters,
        setFilters,
        isLoading,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};
