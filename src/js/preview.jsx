import React from 'react';

const PreviewComponent = (props) => {
    const entry = props.entry;
    const dataItems = [
        { label: 'コース名', name: 'title', widget: 'string' },
        { label: 'コース名(英文)', name: 'title_en', widget: 'string' },
        { label: 'コース説明', name: 'description', widget: 'string' },
        {
            label: '平日/休日/全日',
            name: 'weekday',
            widget: 'select',
            options: ['平日', '土日祝日', '全日'],
        },
        {
            label: 'ランチ/ディナー',
            name: 'lunchdinner',
            widget: 'select',
            options: [
                { label: 'ランチ', value: 'lunch' },
                { label: 'ディナー', value: 'dinner' },
            ],
        },
        { label: '価格(税込)', name: 'price', widget: 'number' },
        {
            label: 'スタート価格',
            name: 'isStartPrice',
            widget: 'boolean',
            required: false,
        },
        { label: '並び順', name: 'sort', widget: 'number' },
        {
            label: '料理',
            name: 'menuItem',
            widget: 'list',
            summary: '{{fields.title}}',
            fields: [
                { label: 'タイトル', name: 'title', widget: 'string' },
                { label: '説明', name: 'description', widget: 'string' },
            ],
        },
    ];
    const data = dataItems.reduce((acc, rcc) => {
        let value;
        if (rcc.widget === 'list') {
            value = props
                .widgetsFor(rcc.name)
                .toArray()
                .map((item, i) =>
                    rcc.fields.reduce(
                        (acc2, rcc2) => ({
                            ...acc2,
                            [rcc2.name]: item?.getIn(['data', rcc2.name]) || "",
                        }),
                        {},
                    ),
                );
        } else if (
            rcc.widget === 'select' &&
            !rcc.options.every((item) => typeof item === 'string')
        ) {
            value = rcc.options.find(
                (option) => option.value === (entry?.getIn(['data', rcc.name]) || "")
            )?.label || "";
        } else {
            value = entry?.getIn(['data', rcc.name]) || "";
        }
        return { ...acc, [rcc.name]: value };
    }, { body: props.widgetFor('body') || ""});
    return (
        <div class="container">
            <h4 class="type">
                {data.weekday} {data.lunchdinner}
            </h4>
            <h1 class="menuname">
                {data.title}{' '}
                <span class="h3">
                    ¥{data.price}
                    {data.isStartPrice ? '~' : ''}
                </span>
            </h1>
            <h4>{data.title_en}</h4>
            <p>{data.description}</p>
            {data.menuItem.map((item) => (
                <React.Fragment key={item.title}>
                    <h4 class="itemname">{item.title}</h4>
                    <span>{item.description}</span>
                </React.Fragment>
            ))}
            <p>{data.body}</p>
        </div>
    );
};

export default PreviewComponent;
