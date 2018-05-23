import { simpleField } from '@ngx-dino/core';
import { access } from '@ngx-dino/core/src/v2/operators/methods/extracting/access';
import { combine } from '@ngx-dino/core/src/v2/operators/methods/grouping/combine';
import { chain } from '@ngx-dino/core/src/v2/operators/methods/grouping/chain';
import { map } from '@ngx-dino/core/src/v2/operators/methods/transforming/map';


export const nodeIdField = simpleField({
  label: 'Node Id',
  operator: access('id')
});

export const nodeOrderField = simpleField({
  label: 'Node Order',
  operator: access('order')
});

// Node weight implemented in service
// Node color implemented in service

export const nodeTooltipField = simpleField({
  label: 'Node Tooltip',
  operator: chain(combine({
    label: access('level1Label'),
    moduleName: access('description'),
    time: access('totalTime')
  }), map(({label, moduleName, time}) => {
    const smodule = `Module: ${moduleName}`;
    const slabel = `Label: ${label}`;
    const stime = `Time Spent: ${time} minutes`;
    const parts = (moduleName ? [smodule] : []).concat([slabel, stime]);
    return parts.join('\n');
  }))
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
  operator: chain(access<string>('timestamp'), map((t) => +(new Date(t))))
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

export const edgeTooltipField = simpleField({
  label: 'Edge Tooltip',
  operator: map(() => 'FIXME') // FIXME
});
