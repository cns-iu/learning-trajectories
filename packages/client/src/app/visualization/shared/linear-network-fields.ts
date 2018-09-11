import { simpleField } from '@ngx-dino/core';
import { access } from '@ngx-dino/core/src/operators/methods/extracting/access';
import { combine } from '@ngx-dino/core/src/operators/methods/grouping/combine';
import { chain } from '@ngx-dino/core/src/operators/methods/grouping/chain';
import { map } from '@ngx-dino/core/src/operators/methods/transforming/map';


export const nodeIdField = simpleField({
  label: 'Node Id',
  operator: access('id')
});

export const nodeOrderField = simpleField({
  label: 'Node Order',
  operator: access('order')
});

// Node weight implemented in service

export const nodeColorField = simpleField({
  label: 'nodeColor',
  operator: chain(access<string>('moduleType'), map((type) => {
    if (type.endsWith('+block')) {
      type = type.slice(0, -6);
    }

    switch (type) {
      case 'html':
        return '#90CBFB';

      case 'problem':
        return '#EFC96A';

      case 'video':
        return '#70B637';

      case 'openassessment':
        return '#8E1B86';

      case 'drag-and-drop-v2':
        return '#FDFF7E';

      case 'word_cloud':
        return '#C24519';

      default:
        return '#000000';
    }
  }))
});

export const nodeTooltipField = simpleField({
  label: 'Node Tooltip',
  operator: chain(combine([
    chain(access('level1Label'), map((s) => `Chapter: ${s}`)),
    chain(access('level2Label'), map((s) => `Page: ${s}`)),
    chain(access('totalTime'), map((s) => `Total Time Spent: ${s} minutes`))
  ]), map((parts: string[]) => parts.join('\n')))
});


export const edgeIdField = simpleField({
  label: 'Edge Id',
  operator: chain(combine({
    source: access('source'),
    target: access('target')
  }), map(({source, target}) => `${source}|${target}`))
});

export const edgeOrderField = simpleField({
  label: 'Edge Order',
  operator: chain(access<string>('timestamp'), map((t) => {
    const re = /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/;
    const match = re.exec(t);
    const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
    const date = new Date(year, month, day, hour, minute, second);
    return +date;
  }))
});

// edgeWeight implemented in service

export const edgeSourceField = simpleField({
  label: 'Edge Source',
  operator: access('source')
});

export const edgeTargetField = simpleField({
  label: 'Edge Target',
  operator: access('target')
});
// TODO:
// ${edge.sourceModule.l2label} => (or <=)
// ${edge.targetModule.l2label}
// Number of Transitions: ${edge.count}

export const edgeTooltipField = simpleField({
  label: 'Edge Tooltip',
  operator: chain(combine({
    sourceLabel: access(['sourceModule', 'level2Label']),
    targetLabel: access(['targetModule', 'level2Label']),
    direction: chain(access('direction'), map((d) => {
      return d === 'p' ? '->' : '<-';
    })),
    count: access('count')
  }), map(({sourceLabel, targetLabel, direction, count}) => {
    return [
      `${sourceLabel} ${direction} ${targetLabel}`,
      `Number of Transitions: ${count}`
    ].join('\n');
  }))
});

export const nodeLabelField = simpleField<string>({
  label: 'Node Group Label',
  operator: chain(
    access('level1Label'),
    map((label: string): string => {
      const subtitleSplit = label.trim().split(':');
      if (subtitleSplit.length > 1) {
        return subtitleSplit[0].trim();
      } else {
        const metaDataSplit = label.trim().split('(');
        if (metaDataSplit.length > 1) {
          return metaDataSplit[0].trim();
        }
      }
      return label.trim();
    })
  )
});
