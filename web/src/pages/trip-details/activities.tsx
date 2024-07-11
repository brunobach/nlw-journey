import { CircleCheck } from "lucide-react";
import { api } from "../../lib/axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO, compareAsc} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  title: string;
  occurs_at: string;
}

interface GroupedActivities {
  date: string;
  activities: Activity[];
}

const groupActivitiesByDate = (activities: Activity[]): GroupedActivities[] => {
  const grouped: { [date: string]: Activity[] } = {};

  activities.forEach(activity => {
    const date = format(parseISO(activity.occurs_at), 'yyyy-MM-dd');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => compareAsc(parseISO(a), parseISO(b)));

  return sortedDates.map(date => ({
    date,
    activities: grouped[date],
  }));
};

export function Activities() {
  const { tripId } = useParams();
  const [groupedActivities, setGroupedActivities] = useState<GroupedActivities[]>([]);

  useEffect(() => {
    api.get(`trips/${tripId}/activities`).then(response => {
      const fetchedActivities = response.data.activities.flatMap((item: GroupedActivities) => item.activities);
      setGroupedActivities(groupActivitiesByDate(fetchedActivities));
    });
  }, [tripId]);

  return (
    <div className="space-y-8">
      {groupedActivities.map(category => (
        <div key={category.date} className="space-y-2.5">
          <div className="flex gap-2 items-baseline">
            <span className="text-xl text-zinc-300 font-semibold">Dia {format(parseISO(category.date), 'd')}</span>
            <span className="text-xs text-zinc-500">{format(parseISO(category.date), 'EEEE', { locale: ptBR })}</span>
          </div>
          {category.activities.length > 0 ? (
            <div>
              {category.activities.map(activity => (
                <div key={activity.id} className="space-y-2.5">
                  <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                    <CircleCheck className="size-5 text-lime-300" />
                    <span className="text-zinc-100">{activity.title}</span>
                    <span className="text-zinc-400 text-sm ml-auto">
                      {format(parseISO(activity.occurs_at), 'HH:mm')}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
          )}
        </div>
      ))}
    </div>
  );
}
