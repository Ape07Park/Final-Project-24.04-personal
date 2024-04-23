import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addWatchVideoRecord, getWatchVideoRecord, getWatchVideoCount } from '../api/firebase';

export default function useWatchVideo(user) {
  const queryClient = useQueryClient();
  const uid = user && user.uid;
  
  // producer
  const getRecord = useQuery({
    queryKey: ['watchVideo'],
    queryFn: getWatchVideoRecord,
    staleTime: 1000 * 60 * 5 // 5분 후에 자동으로 db에 접근해 바꾸기 
  });

  // producer
  const getCount = useQuery({
    queryKey: ['watchVideo', uid],
    queryFn: () => getWatchVideoCount(uid),
    staleTime: 1000 * 60 * 5
  });

  // consumer
  // useMutation: React-Query를 이용해 서버에 변경(insert, update, delete) 작업 요청 시 사용
  const addRecord = useMutation({
    mutationFn: ({user, video}) => addWatchVideoRecord({user, video}),
    onSuccess: () => queryClient.invalidateQueries(['watchVideo', uid]) // watchVideo 키를 지닌 value를 해당 uid 가지고 있는 사람 걸 바꿈  
  });

  return { getRecord, getCount, addRecord };
}