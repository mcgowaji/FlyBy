from collections import Counter
from operator import itemgetter
import sys
import pandas as pd

#Word counts per cluster
def word_freqs(df, textcol):
    results = []
    for n in range(int(df.Cluster.max())):
        #Filter out all lines except this cluster
        section = df[df.Cluster == n]
        # Combine words into a long string
        long_string = ''.join([x for x in section[textcol]])
        #save top 20
        top20 = sorted(Counter(long_string.split()).items(), key = itemgetter(1), reverse=True)[:20]
        for ans in top20:
            results.append((n, *ans))
            
    cols = ['cluster', 'text', 'frequency']
    results = sorted(results, key = itemgetter(0))
    return pd.DataFrame(results,columns=cols)


if __name__ == "__main__":
    df = pd.read_csv(sys.argv[1])
    results = word_freqs(df, 'Synopsis')
    new_df_name = sys.argv[1].split('.')[0]+'_word_counts.csv'
    results.to_csv(new_df_name, index=False)
    print(f'results saved to {new_df_name}.')